// Generate random integer, we will use this to use random message from list of dummy messages.
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Generate unique key for message component of FlatList.
export const generateUniqueKey = () =>
  `_${Math.random().toString(36).substr(2, 9)}`;

let idx = 0;

// Mocks the api call to query 'n' number of messages.
export const queryMoreMessages = n => {
  return new Promise(resolve => {
    const newMessages = [];

    for (let i = 0; i < n; i++) {
      const messageText = testMessages[getRandomInt(0, testMessages.length)];
      newMessages.push({
        id: generateUniqueKey() + '_' + idx++,
        text: messageText,
        isMyMessage: Boolean(getRandomInt(0, 2)), // Randomly assign true or false.
      });
    }

    // Lets resolve after 500 ms, to simulate network latency.
    setTimeout(() => {
      resolve(newMessages);
    }, 500);
  });
};

// List of test messages to generate chat data.
export const testMessages = [
  'Hey, where were you yesterday? I was trying to call you',
  'Yeah dude!! Had a really bad night. I was really hungover',
  'lol, thats so typical you. Who did you go out with?',
  'Dont even ask me about it, I am never going drink with Uthred again. That dude is a beast',
  'hahahaha, I can totally imagine!!',
  'Ciao :)',
];
