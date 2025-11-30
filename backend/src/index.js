import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { formSchema } from './formSchema.js';
import { validateSubmission } from './validation.js';
import { 
  saveSubmission, 
  getPaginatedSubmissions, 
  getSubmissionById,
  updateSubmission,
  deleteSubmission 
} from './storage.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// GET /api/form-schema
app.get('/api/form-schema', (req, res) => {
  res.json(formSchema);
});

// POST /api/submissions
app.post('/api/submissions', (req, res) => {
  try {
    const data = req.body;
    
    // Validate submission
    const errors = validateSubmission(data);
    
    if (errors) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    // Create submission
    const submission = {
      id: uuidv4(),
      data,
      createdAt: new Date().toISOString()
    };
    
    saveSubmission(submission);
    
    res.status(201).json({
      success: true,
      id: submission.id,
      createdAt: submission.createdAt
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/submissions
app.get('/api/submissions', (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
    const search = req.query.search || '';
    
    const result = getPaginatedSubmissions({ page, limit, sortBy, sortOrder, search });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/submissions/:id
app.get('/api/submissions/:id', (req, res) => {
  try {
    const submission = getSubmissionById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/submissions/:id
app.put('/api/submissions/:id', (req, res) => {
  try {
    const data = req.body;
    
    // Validate submission
    const errors = validateSubmission(data);
    
    if (errors) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    const updated = updateSubmission(req.params.id, { data });
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/submissions/:id
app.delete('/api/submissions/:id', (req, res) => {
  try {
    const deleted = deleteSubmission(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
