import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) {
      return res.status(400).json({ message: 'userEmail is required' });
    }

    const notes = await Note.find({ userEmail }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};


export const createNote = async (req, res) => {
  try {
    const { text, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: 'userEmail is required' });
    }

    const note = await Note.create({ text, userEmail });
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating note' });
  }
};


export const updateNote = async (req, res) => {
  try {
    const { text } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
};
