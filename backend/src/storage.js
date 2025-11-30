import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/submissions.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

export function getAllSubmissions() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

export function saveSubmission(submission) {
  const submissions = getAllSubmissions();
  submissions.push(submission);
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
  return submission;
}

export function getSubmissionById(id) {
  const submissions = getAllSubmissions();
  return submissions.find(s => s.id === id);
}

export function updateSubmission(id, data) {
  const submissions = getAllSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  
  if (index === -1) {
    return null;
  }
  
  submissions[index] = { ...submissions[index], ...data, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
  return submissions[index];
}

export function deleteSubmission(id) {
  const submissions = getAllSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  
  if (index === -1) {
    return false;
  }
  
  submissions.splice(index, 1);
  fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
  return true;
}

export function getPaginatedSubmissions({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search = '' }) {
  let submissions = getAllSubmissions();
  
  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    submissions = submissions.filter(s => {
      return Object.values(s.data || {}).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        if (Array.isArray(value)) {
          return value.some(v => v.toLowerCase().includes(searchLower));
        }
        return false;
      });
    });
  }
  
  // Sort
  submissions.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'createdAt') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });
  
  const total = submissions.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = submissions.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}
