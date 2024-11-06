import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const ConfirmationAlert = ({ message, modalVisible, setModalVisible, onPressCancel, onPress, cancelButtonText, buttonText }) => {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
          <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                  <Text style={styles.message}>{message}</Text>
                  <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.button} onPress={onPressCancel}>
                          <Text style={styles.buttonText}>{cancelButtonText}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={onPress}>
                          <Text style={styles.buttonText}>{buttonText}</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ConfirmationAlert;
