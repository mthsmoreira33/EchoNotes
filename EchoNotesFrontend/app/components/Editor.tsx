import React from 'react';
import { View, TextInput } from 'react-native';
import { styles } from '../styles';

interface EditorProps {
    title: string;
    content: string;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    titleInputRef: React.Ref<TextInput>;
}

export default function Editor({ title, content, setTitle, setContent, titleInputRef }: EditorProps) {
    return (
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
}