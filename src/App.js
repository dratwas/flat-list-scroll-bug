import React, {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import throttle from 'lodash.throttle';
import {FlatList} from 'react-native-bidirectional-infinite-scroll';

import {MessageBubble} from './MessageBubble';
import {queryMoreMessages} from './utils';

const renderIt = ({item}) => <MessageBubble item={item} />;
const keyExtract = item => item.id;

const split = arr => {
  if (arr.length > 50) {
    return [arr.slice(0, 50), arr.slice(50, arr.length)];
  }
  return arr;
};

const App = () => {
  const scrollRef = useRef();
  const batcher = useRef([]);
  const batcherBottom = useRef([]);

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const initChat = async () => {
      const initialMessages = await queryMoreMessages(100);
      if (!initialMessages) {
        return;
      }

      setMessages(initialMessages.reverse());
    };

    initChat();
  }, []);

  const onScrollFailed = useCallback(info => {
    const wait = new Promise(resolve => setTimeout(resolve, 50));
    wait.then(() => {
      scrollRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    });
  }, []);

  const onStartReached = useCallback(async () => {
    const fun = async () => {
      if (batcherBottom.current.length > 0) {
        setMessages(m => {
          return [...batcherBottom.current.reverse(), ...m];
        });
        batcherBottom.current = [];
      } else {
        const newMessages = await queryMoreMessages(100);
        if (newMessages.length > 50) {
          const [toRender, toBatch] = split(newMessages);
          batcherBottom.current = [
            ...toBatch.reverse(),
            ...batcherBottom.current,
          ];
          setMessages(m => {
            return [...toRender.reverse(), ...m];
          });
        } else {
          setMessages(m => {
            return [...newMessages.reverse(), ...m];
          });
        }
      }
    };
    return fun();
  }, [setMessages]);

  const onReachStartDebounced = useMemo(() => {
    return throttle(onStartReached, 1000);
  }, [onStartReached]);

  const onStart = useCallback(async () => {
    onReachStartDebounced();
  }, [onReachStartDebounced]);

  const onEndReached = useCallback(async () => {
    const fun = async () => {
      if (batcher.current.length > 0) {
        setMessages(m => {
          return [...m, ...batcher.current.reverse()];
        });
        batcher.current = [];
      } else {
        const newMessages = await queryMoreMessages(100);
        if (newMessages.length > 50) {
          const [toRender, toBatch] = split(newMessages);
          batcher.current = [...batcher.current, ...toBatch];
          setMessages(m => {
            return [...m, ...toRender.reverse()];
          });
        } else {
          setMessages(m => {
            return [...m, ...newMessages.reverse()];
          });
        }
      }
    };
    return fun();
  }, [setMessages]);

  const onReachEndDebounced = useMemo(() => {
    return throttle(onEndReached, 1500);
  }, [onEndReached]);

  const onEnd = useCallback(async () => {
    onReachEndDebounced();
  }, [onReachEndDebounced]);

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
              return [...newMessages.reverse(), ...m];
            });
          }}>
          <Text>Simulate new 5 messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            const newMessages = await queryMoreMessages(1);
            setMessages(m => {
              return [...newMessages.reverse(), ...m];
            });
          }}>
          <Text>Simulate new message</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        inverted
        ref={scrollRef}
        showDefaultLoadingIndicators={true}
        data={messages}
        initialScrollIndex={messages.length / 2}
        onScrollToIndexFailed={onScrollFailed}
        renderItem={renderIt}
        keyExtractor={keyExtract}
        maxToRenderPerBatch={100}
        enableAutoscrollToTop={true}
        onStartReached={onStart}
        onEndReached={onEnd}
      />
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
