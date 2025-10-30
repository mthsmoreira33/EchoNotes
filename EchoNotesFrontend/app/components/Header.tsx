import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

interface HeaderProps {
    isMenuVisible: boolean;
    setMenuVisible: (visible: boolean) => void;
    isLargeScreen: boolean;
}

export default function Header({ isMenuVisible, setMenuVisible, isLargeScreen }: HeaderProps) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => setMenuVisible(!isMenuVisible)} style={styles.menuButton}>
                <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>EchoNotes</Text>
            {!isLargeScreen && <View style={styles.headerRightPlaceholder} />}
        </View>
    );
}