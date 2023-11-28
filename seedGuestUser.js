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
    console.log(thread)
    threads.push(thread);
    await thread.save()
    return thread
  }

  async function createMessage( threadIndex, from, toArray) {
    let thread = threads[threadIndex]
    const message = new Message({
        text: faker.word.words({ count: { min: 3, max: 30 } }),
        from: from,
        to: toArray,
        thread: thread
    })
    thread.messages.push(message);
    await message.save()
    await thread.save()
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
      let convoUsers = [users[1], users[3], users[5]]
      for (let i = 0; i < userCount/2; i++) {
        const thread = await createThread([users[1], users[3], users[5], guestUser]);
        for (let j = 0; j < 5; j++) {
            await createMessage(i, guestUser, convoUsers)
            let recipients = convoUsers.filter((element, index) => 
                index !==  convoUsers[j % 3]
            )
            recipients.push(guestUser)
            await createMessage(i, convoUsers[j % 3], recipients);
        }
        console.log('multi-user thread created')
      }

      console.log('done');
      return;
  }

seed();
return;