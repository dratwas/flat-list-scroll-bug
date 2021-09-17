import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const MessageBubble = React.memo(
  ({item}) => {
    return (
      <View
        style={[
          styles.messageBubble,
          item.isMyMessage && styles.myMessageBubble,
        ]}>
        <Text
          style={item.isMyMessage ? styles.myMessageText : styles.messageText}>
          {item.text}
        </Text>
        <Text>{item.id}</Text>
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id,
);

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
