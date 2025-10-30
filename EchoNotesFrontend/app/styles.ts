import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
        width: 44,
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
        width: 44,
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
    infoButtonContainer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    infoButton: {
        backgroundColor: 'yellow',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoModalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    infoModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoModalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    infoModalCloseButton: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    infoModalCloseButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },

});