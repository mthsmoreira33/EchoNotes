import React, { useState, useEffect, useRef, useCallback } from 'react'; // Import useRef
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Button, FlatList, StyleSheet, TextInput, TouchableOpacity, Dimensions, Platform, Modal } from 'react-native';

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { width } = Dimensions.get('window');
  const isLargeScreen = Platform.OS === 'web' && width > 768;

  const [isMenuVisible, setMenuVisible] = useState(isLargeScreen);
  const [noteListRenderKey, setNoteListRenderKey] = useState(0);

  const handleSave = useCallback(() => {
    if (title.trim() === '' && content.trim() === '') {
        return;
    }

    if (activeNote) {
        // Update existing note
        const updatedNotes = notes.map(note =>
            note.id === activeNote.id ? { ...note, title, content } : note
        );
        setNotes(updatedNotes);
    } else {
        // Create new note
        const newNote = {
            id: Date.now().toString(), // Simple unique ID
            title,
            content,
        };
        const newNotes = [newNote, ...notes];
        setNotes(newNotes);
        setActiveNote(newNote);
    }
    setNoteListRenderKey(prevKey => prevKey + 1);
  }, [activeNote, content, notes, title]);

  const titleInputRef = useRef<TextInput>(null); // Create a ref for the title TextInput

  const handleSelectNote = useCallback((note: Note) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    if (!isLargeScreen) {
      setMenuVisible(false);
    }
  }, [isLargeScreen]);

  const handleNewNote = useCallback(() => {
    setActiveNote(null);
    setTitle('');
    setContent('');
    if (!isLargeScreen) {
      setMenuVisible(false);
    }
  }, [isLargeScreen]);

  const handleDelete = useCallback((id: string) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    setNoteListRenderKey(prevKey => prevKey + 1);

    if (activeNote && activeNote.id === id) {
        if (newNotes.length > 0) {
            handleSelectNote(newNotes[0]);
        } else {
            handleNewNote();
        }
    }
  }, [activeNote, notes, handleSelectNote, handleNewNote]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSave();
    }, 500); // a 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, handleSave]);

  const renderNoteList = () => (
    <View style={styles.listContainer}>
      <TouchableOpacity style={styles.newNoteButton} onPress={handleNewNote}>
        <Text style={styles.newNoteButtonText}>+ New Note</Text>
      </TouchableOpacity>

      <FlatList
        key={noteListRenderKey}
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.noteListItem, activeNote?.id === item.id && styles.activeNoteListItem]}
            onPress={() => handleSelectNote(item)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.noteListItemTitle} numberOfLines={1}>{item.title || 'New Note'}</Text>
              </View>
              {activeNote?.id === item.id && (
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteNoteButton}>
                  <Text style={styles.deleteNoteButtonText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderEditor = () => (
    <View style={styles.contentArea}>
      <TextInput
        ref={titleInputRef}
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Start writing..."
        value={content}
        onChangeText={setContent}
        multiline
      />

    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(!isMenuVisible)} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EchoNotes</Text>
        {!isLargeScreen && <View style={styles.headerRightPlaceholder} />}
      </View>
      <View style={styles.main}>
        {isMenuVisible && (
            isLargeScreen ? (
                <View key={noteListRenderKey} style={styles.sideMenuWeb}>
                    {renderNoteList()}
                </View>
            ) : (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isMenuVisible}
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setMenuVisible(false)}>
                        <View key={noteListRenderKey} style={styles.mobileMenu}>
                            {renderNoteList()}
                        </View>
                    </TouchableOpacity>
                </Modal>
            )
        )}
        {renderEditor()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    menuButton: {
        padding: 10,
        width: 44, // Explicit width for consistent centering
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuButtonText: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 42,
        fontFamily: 'LobsterTwo_700Bold',
        textAlign: 'center',
        flex: 1,
    },
    headerRightPlaceholder: {
        width: 44, // Same width as menuButton for balancing
    },
    main: {
        flex: 1,
        flexDirection: 'row',
    },
    sideMenuWeb: {
        width: 300,
        backgroundColor: '#fafafa',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    listContainer: {
        flex: 1,
    },
    newNoteButton: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#eee'
    },
    newNoteButtonText: {
        fontSize: 18,
        fontFamily: 'Abel_400Regular',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    noteListItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    activeNoteListItem: {
        backgroundColor: '#e0e0e0',
    },
    noteListItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Abel_400Regular',
    },
    noteListItemContent: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Abel_400Regular',
    },
    contentArea: {
        flex: 1,
        padding: 20,
    },
    titleInput: {
        fontSize: 24,
        fontFamily: 'Abel_400Regular',
        marginBottom: 20,
        paddingBottom: 10,
        outlineWidth: 0,
    },
    contentInput: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Abel_400Regular',
        textAlignVertical: 'top',
        outlineWidth: 0,
    },
    deleteButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Abel_400Regular',
    },
    deleteNoteButton: {
        backgroundColor: 'red',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteNoteButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    mobileMenu: {
        width: '80%',
        height: '100%',
        backgroundColor: '#fafafa',
    },

});
