const { faker } = require('@faker-js/faker');
const User = require('./models/User');
const Message = require('./models/Message')
const Thread = require('./models/Thread')
const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');
require('./mongoConfig');

let users = []
let threads = []

function getRandomElementFromArray(arr) {
    if (arr.length === 0) {
      return null; // Return null for an empty array.
    }
  
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  function createRandomArray(arr) {
    const newArrayLength = Math.floor(Math.random() * (6 - 2 + 1)) + 2; // Random length between 2 and 6
    const newArray = [];
  
    // Shuffle the original array to ensure randomness
    const shuffledArray = arr.sort(() => Math.random() - 0.5);
  
    for (let i = 0; i < Math.min(newArrayLength, shuffledArray.length); i++) {
      newArray.push(shuffledArray[i]);
    }
  
    return newArray;
  }

async function createRandomUser() {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
    const user = new User({
      _id: faker.database.mongodbObjectId(),
      username: faker.person.fullName(),
      password: faker.internet.password({ regex: passwordRegex }),
    });
    bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
      user.password = hashedPassword;
      await user.save();
      users.push(user);
    });
    return user;
  }

  async function createGuestUser() {
    const user = new User({
      _id: faker.database.mongodbObjectId(),
      username: 'guest-user',
      password: 'guest%User1',
    });
    bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
      user.password = hashedPassword;
      await user.save();
    });
    return user;
  }

  async function createThread(usersArray) {
    const thread = new Thread({
        users: usersArray,
        messages: []
    })
    threads.push(thread);
    await thread.save()
    return thread
  }

  async function createMessage( threadIndex, from, toArray) {
    const message = new Message({
        text: faker.word.words({ count: { min: 3, max: 30 } }),
        from: from,
        to: toArray,
        thread: threads[threadIndex]
    })
    threads[threadIndex].messages.push(message);
    await message.save()
    await threads[threadIndex].save()
  }

  async function seed() {
    const userCount = 10;

    console.log('creating users')
    for (let i = 0; i < userCount; i++) {
        const user = await createRandomUser();
        users.push(user)
      }

      console.log('creating guest user')
      const guestUser = await createGuestUser();

      console.log('creating 1-1 threads')
      //create 1-1 threads
      for (let i = 0; i < userCount/2; i++) {
        const user = getRandomElementFromArray(users)
        const thread = await createThread([guestUser, user]);
        for (let j = 0; j < 5; j++) {
            await createMessage(i, guestUser, [user])
            await createMessage(i, user, [guestUser]);
        }
        console.log('1-1 thread created')
      }

      console.log('creating multi-user threads')
      //create multi-user threads
     
      for (let i = 0; i < userCount/2; i++) {
        let convoUsers = createRandomArray(users);
        convoUsers.push(guestUser)
        await createThread(convoUsers);
        for (let j = 0; j < 10; j++) {
            // plus 5 to account for 1-1 threads previously created
            let sender = getRandomElementFromArray(convoUsers)
            let recipients = convoUsers.filter((element, index) => 
                index !==  sender
            )
            await createMessage(i + 5, sender, recipients);
        }
        console.log('multi-user thread created')
      }

      console.log('done');
      return;
  }

seed();
return;