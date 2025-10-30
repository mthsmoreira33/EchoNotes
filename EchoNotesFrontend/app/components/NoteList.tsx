import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '../styles';
import { Note } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface NoteListProps {
    notes: Note[];
    activeNote: Note | null;
    noteListRenderKey: number;
    handleSelectNote: (note: Note) => void;
    handleNewNote: () => void;
    handleDelete: (id: string) => void;
    handleInfoPress: (index: number) => void;
}

export default function NoteList({ notes, activeNote, noteListRenderKey, handleSelectNote, handleNewNote, handleDelete, handleInfoPress }: NoteListProps) {
    return (
        <View style={styles.listContainer}>
            <TouchableOpacity style={styles.newNoteButton} onPress={handleNewNote}>
                <Text style={styles.newNoteButtonText}>+ New Note</Text>
            </TouchableOpacity>

            <FlatList
                key={noteListRenderKey}
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[styles.noteListItem, activeNote?.id === item.id && styles.activeNoteListItem]}
                        onPress={() => handleSelectNote(item)}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.noteListItemTitle} numberOfLines={1}>{item.title || 'New Note'}</Text>
                            </View>
                            {activeNote?.id === item.id && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteNoteButton}>
                                        <Text style={styles.deleteNoteButtonText}>X</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleInfoPress(index)} style={styles.infoButton}>
                                        <Ionicons name="information-circle-outline" size={20} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}