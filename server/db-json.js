const fs = require('fs').promises;
const path = require('path');

class JsonDatabase {
  constructor() {
    this.dbPath = path.resolve(__dirname, 'database.json');
    this.data = null;
    this.init();
  }

  async init() {
    try {
      // Check if file exists, if not create it
      try {
        await fs.access(this.dbPath);
      } catch {
        await fs.writeFile(this.dbPath, JSON.stringify({ users: [], nextUserId: 1 }, null, 2));
      }
      
      const fileContent = JSON.parse(await fs.readFile(this.dbPath, 'utf8'));
      
      if (!fileContent) {
        this.data = {
          users: [],
          nextUserId: 1
        };
        await this.save();
      } else {
        this.data = fileContent;
        if (!this.data.nextUserId) {
          this.data.nextUserId = Math.max(...this.data.users.map(u => u.id), 0) + 1;
        }
      }
      console.log('JSON database initialized successfully.');
    } catch (error) {
      console.error('Error initializing database:', error);
      this.data = {
        users: [],
        nextUserId: 1
      };
    }
  }

  async save() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
      throw error;
    }
  }

  run(query, params, callback) {
    if (query.includes('INSERT INTO users')) {
      const [name, email, password] = params;
      const existingUser = this.data.users.find(u => u.email === email);
      
      if (existingUser) {
        const error = new Error('UNIQUE constraint failed: users.email');
        callback(error);
        return;
      }

      const newUser = {
        id: this.data.nextUserId++,
        name,
        email,
        password
      };

      this.data.users.push(newUser);
      this.save().then(() => {
        callback(null);
      }).catch(error => {
        callback(error);
      });
      
      // Mock the 'this.lastID' behavior
      this.lastID = newUser.id;
    } else if (query.includes('SELECT * FROM users WHERE email')) {
      const [email] = params;
      const user = this.data.users.find(u => u.email === email);
      callback(null, user);
    } else {
      callback(new Error('Query not supported'));
    }
  }

  get(query, params, callback) {
    if (query.includes('SELECT * FROM users WHERE email')) {
      const [email] = params;
      const user = this.data.users.find(u => u.email === email);
      callback(null, user);
    } else {
      callback(new Error('Query not supported'));
    }
  }
}

module.exports = new JsonDatabase();
