// Creating devpay db
db = db.getSiblingDB('eventsourcing');
db.createUser({
  user: 'root',
  pwd: 'secure',
  roles: [
    {
      role: 'readWrite',
      db: 'eventsourcing',
    },
  ],
});
