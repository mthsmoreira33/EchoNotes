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

                    const response = await fetch('https://localhost:32771/api/Notes');

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

    

        const handleSave = useCallback(() => {

            if (title.trim() === '' && content.trim() === '') {

                return;

            }

    

            if (activeNote) {

                const updatedNotes = notes.map(note =>

                    note.id === activeNote.id ? { ...note, title, content } : note

                );

                setNotes(updatedNotes);

            } else {

                const newNote = {

                    id: Date.now().toString(),

                    title,

                    content,

                };

                const newNotes = [newNote, ...notes];

                setNotes(newNotes);

                setActiveNote(newNote);

            }

            setNoteListRenderKey(prevKey => prevKey + 1);

        }, [activeNote, content, notes, title]);

    

        const titleInputRef = useRef<TextInput>(null);

    

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

    

        const handleInfoPress = useCallback((index: number) => {

            setInfoModalContent(`Note number: ${index + 1}`);

            setInfoModalVisible(true);

        }, []);

    

        useEffect(() => {

            const handler = setTimeout(() => {

                handleSave();

            }, 500);

    

            return () => {

                clearTimeout(handler);

            };

        }, [title, content, handleSave]);

    

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

    