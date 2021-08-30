import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  // ScrollView,
} from 'react-native';

import {MessageBubble} from './MessageBubble';
import {Message, queryMoreMessages} from './utils';

const App = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const initChat = async () => {
      const initialMessages = await queryMoreMessages(20);
      if (!initialMessages) return;

      setMessages(initialMessages);
    };

    initChat();
  }, []);

  if (!messages.length) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat between two users</Text>
        <TouchableOpacity
          onPress={async () => {
            const newMessages = await queryMoreMessages(10);
            setMessages(m => {
              return (
                newMessages
                  // .map((ms) => ({ ...ms, text: ms.text.slice(0, 20) }))
                  .concat(m)
              );
            });
          }}>
          <Text>Load in the opposite direction</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: undefined,
          minIndexForVisible: 1,
        }}
        renderItem={args => <MessageBubble {...args} />}
        keyExtractor={item => item.id}
      />

      {/* <ScrollView
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: undefined,
          minIndexForVisible: 1,
        }}
      >
        {messages.map((m, i) => {
          return <MessageBubble item={m} index={i} />;
        })}
      </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#BEBEBE',
    borderBottomWidth: 1,
  },
  headerTitle: {fontSize: 20, fontWeight: 'bold'},
  safeArea: {
    flex: 1,
  },
  sendMessageButton: {
    width: '100%',
    padding: 20,
    backgroundColor: '#FF4500',
    alignItems: 'center',
  },
  sendButtonTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default App;
