const fs = require('fs');
const path = require('path');

// Simple file-based database using JSON
class SimpleDB {
  constructor(dbPath = './data') {
    this.dbPath = dbPath;
    this.ensureDirectory();
  }

  ensureDirectory() {
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }
  }

  getFilePath(table) {
    return path.join(this.dbPath, `${table}.json`);
  }

  read(table) {
    try {
      const filePath = this.getFilePath(table);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${table}:`, error);
      return [];
    }
  }

  write(table, data) {
    try {
      const filePath = this.getFilePath(table);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${table}:`, error);
      return false;
    }
  }

  findById(table, id) {
    const data = this.read(table);
    return data.find(item => item.id == id);
  }

  findBy(table, field, value) {
    const data = this.read(table);
    return data.filter(item => item[field] == value);
  }

  insert(table, item) {
    const data = this.read(table);
    
    // Generate ID if not provided
    if (!item.id) {
      const maxId = data.length > 0 ? Math.max(...data.map(d => d.id || 0)) : 0;
      item.id = maxId + 1;
    }
    
    // Add timestamp
    item.createdAt = item.createdAt || new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    
    data.push(item);
    return this.write(table, data) ? item : null;
  }

  update(table, id, updates) {
    const data = this.read(table);
    const index = data.findIndex(item => item.id == id);
    
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
    return this.write(table, data) ? data[index] : null;
  }

  delete(table, id) {
    const data = this.read(table);
    const filteredData = data.filter(item => item.id != id);
    
    if (filteredData.length === data.length) return false;
    
    return this.write(table, filteredData);
  }

  truncate(table) {
    return this.write(table, []);
  }

  seed(table, seedData) {
    // Only seed if table is empty
    const currentData = this.read(table);
    if (currentData.length === 0) {
      return this.write(table, seedData);
    }
    return false;
  }
}

module.exports = SimpleDB;