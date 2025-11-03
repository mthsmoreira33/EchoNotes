import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Dimensions, Platform, Modal, TouchableOpacity, TextInput, Text } from 'react-native';
import { styles } from './styles';
import { Note } from './types';
import Header from './components/Header';
import NoteList from './components/NoteList';
import Editor from './components/Editor';

export default function Index() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { width } = Dimensions.get('window');
    const isLargeScreen = Platform.OS === 'web' && width > 768;

    const [isMenuVisible, setMenuVisible] = useState(isLargeScreen);
    const [noteListRenderKey, setNoteListRenderKey] = useState(0);
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);
    const [infoModalContent, setInfoModalContent] = useState('');

        useEffect(() => {

            const fetchNotes = async () => {

                console.log("Attempting to fetch notes...");

                try {

                    const response = await fetch('http://localhost:8083/api/Notes');

                    console.log("Fetch response status:", response.status);

                    if (!response.ok) {

                        throw new Error('Network response was not ok');

                    }

                    const data = await response.json();

                    console.log("Notes fetched successfully:", data);

                    setNotes(data);

                } catch (error) {

                    console.error("Failed to fetch notes:", error);

                    // Optionally, set an error state to display a message to the user

                }

            };

    

            fetchNotes();

        }, []);

    

    const activeNoteRef = useRef(activeNote);
    activeNoteRef.current = activeNote;

    const notesRef = useRef(notes);
    notesRef.current = notes;

    const titleRef = useRef(title);
    titleRef.current = title;

    const contentRef = useRef(content);
    contentRef.current = content;

    const handleSave = async () => {
        const currentActiveNote = activeNoteRef.current;
        console.log("handleSave - currentActiveNote:", currentActiveNote);
        const currentNotes = notesRef.current;
        const currentTitle = titleRef.current;
        const currentContent = contentRef.current;

        if (!currentActiveNote && (currentTitle.trim() !== '' || currentContent.trim() !== '')) {
            try {
                const response = await fetch('http://localhost:8083/api/Notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: currentTitle, content: currentContent }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const newNote = await response.json();
                setNotes(prevNotes => [newNote, ...prevNotes]);
                setActiveNote(newNote);
                setNoteListRenderKey(prevKey => prevKey + 1);
            } catch (error) {
                console.error("Failed to create new note:", error);
            }
        } else if (currentActiveNote) {
            const updatedNote = { ...currentActiveNote, title: currentTitle, content: currentContent };
            console.log("Updating note:", updatedNote);
            try {
                const response = await fetch(`http://localhost:8083/api/Notes/${currentActiveNote.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedNote),
                    }
                );

                console.log("Update response status:", response.status);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const updatedNotes = currentNotes.map(note =>
                    note.id === currentActiveNote.id ? updatedNote : note
                );
                setNotes(updatedNotes);
                setNoteListRenderKey(prevKey => prevKey + 1);
            } catch (error) {
                console.error(`Failed to update note with id ${currentActiveNote.id}:`, error);
            }
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            handleSave();
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [title, content]);

    const handleSelectNote = useCallback((note: Note) => {
        console.log("Selected note:", note);
        setActiveNote(note);
        setTitle(note.title);
        setContent(note.content);
        if (!isLargeScreen) {
            setMenuVisible(false);
        }
    }, [isLargeScreen]);

    const handleNewNote = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8083/api/Notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: '', content: '' }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newNote = await response.json();
            setNotes(prevNotes => [newNote, ...prevNotes]);
            setActiveNote(newNote);
            setTitle(newNote.title);
            setContent(newNote.content);
            setNoteListRenderKey(prevKey => prevKey + 1);
            if (!isLargeScreen) {
                setMenuVisible(false);
            }
        } catch (error) {
            console.error("Failed to create new note:", error);
        }
    }, [isLargeScreen]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8083/api/Notes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setNotes(prevNotes => {
                const newNotes = prevNotes.filter(note => note.id !== id);
                if (activeNoteRef.current && activeNoteRef.current.id === id) {
                    if (newNotes.length > 0) {
                        setActiveNote(newNotes[0]);
                        setTitle(newNotes[0].title);
                        setContent(newNotes[0].content);
                    } else {
                        setActiveNote(null);
                        setTitle('');
                        setContent('');
                    }
                }
                return newNotes;
            });
            setNoteListRenderKey(prevKey => prevKey + 1);

        } catch (error) {
            console.error(`Failed to delete note with id ${id}:`, error);
        }
    }, []);

    const titleInputRef = useRef<TextInput>(null);

    const handleInfoPress = useCallback((index: number) => {
        setInfoModalContent(`Note number: ${index + 1}`);
        setInfoModalVisible(true);
    }, []);



    

        const renderNoteList = () => {

            console.log("Notes passed to NoteList:", notes);

            return (

                <NoteList

                    notes={notes}

                    activeNote={activeNote}

                    noteListRenderKey={noteListRenderKey}

                    handleSelectNote={handleSelectNote}

                    handleNewNote={handleNewNote}

                    handleDelete={handleDelete}

                    handleInfoPress={handleInfoPress}

                />

            );

        };

    

        return (

            <SafeAreaView style={styles.container}>

                <Header

                    isMenuVisible={isMenuVisible}

                    setMenuVisible={setMenuVisible}

                    isLargeScreen={isLargeScreen}

                />

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

                    <Editor

                        title={title}

                        content={content}

                        setTitle={setTitle}

                        setContent={setContent}

                        titleInputRef={titleInputRef}

                    />

                </View>

    

                <Modal

                    animationType="fade"

                    transparent={true}

                    visible={isInfoModalVisible}

                    onRequestClose={() => setInfoModalVisible(false)}

                >

                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setInfoModalVisible(false)}>

                        <View style={styles.infoModalContainer}>

                            <View style={styles.infoModalContent}>

                                <Text style={styles.infoModalText}>{infoModalContent}</Text>

                                <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.infoModalCloseButton}>

                                    <Text style={styles.infoModalCloseButtonText}>Close</Text>

                                </TouchableOpacity>

                            </View>

                        </View>

                    </TouchableOpacity>

                </Modal>

            </SafeAreaView>

        );

    }

    