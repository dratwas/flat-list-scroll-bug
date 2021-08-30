import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const MessageBubble = ({item}) => {
  useEffect(() => {
    console.log('123!@#', 'MessageBubble mount', item.id);

    return () => {
      console.log('123!@#', 'MessageBubble unmount', item.id);
    };
  }, [item.id]);

  if (item.isMyMessage) {
    return (
      <View
        key={`${item.id}`}
        style={[styles.messageBubble, styles.myMessageBubble]}>
        <Text style={styles.myMessageText}>{item.text}</Text>
        <Text>{item.id}</Text>
      </View>
    );
  }

  return (
    <View key={`${item.id}`} style={styles.messageBubble}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text>{item.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: 300,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F1F0F0',
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    // borderColor: '#989898',
    // borderWidth: 1,
    backgroundColor: '#3784FF',
  },
  messageText: {
    fontSize: 15,
  },
  myMessageText: {
    color: 'white',
    fontSize: 15,
  },
});
