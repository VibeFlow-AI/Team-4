import { NextFunction, Request, Response } from 'express';
import { Item } from '../models/Item';

// Create an item
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      res.status(400).json({
        error: {
          code: 400,
          message: 'Name is required',
          details: ['Item name cannot be empty']
        }
      });
      return;
    }

    const item = new Item({ name });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Read all items
export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Read single item
export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    
    if (!item) {
      res.status(404).json({
        error: {
          code: 404,
          message: 'Item not found',
          details: [`Item with id ${id} does not exist`]
        }
      });
      return;
    }
    
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Update an item
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        error: {
          code: 400,
          message: 'Name is required',
          details: ['Item name cannot be empty']
        }
      });
      return;
    }

    const item = await Item.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({
        error: {
          code: 404,
          message: 'Item not found',
          details: [`Item with id ${id} does not exist`]
        }
      });
      return;
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

// Delete an item
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      res.status(404).json({
        error: {
          code: 404,
          message: 'Item not found',
          details: [`Item with id ${id} does not exist`]
        }
      });
      return;
    }

    res.json({
      message: 'Item deleted successfully',
      item: deletedItem
    });
  } catch (error) {
    next(error);
  }
};
