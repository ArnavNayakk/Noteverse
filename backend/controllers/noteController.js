import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

export const createNote = async (req, res) => {
  try {
    const note = new Note({
      user: req.user._id,
      text: req.body.text || 'New note'
    });
    const saved = await note.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error creating note', error });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.text = req.body.text || note.text;
    const saved = await note.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error updating note', error });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting note', error });
  }
};
