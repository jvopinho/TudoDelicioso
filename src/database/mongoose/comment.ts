import {
  Schema,
  model,
  InferSchemaType,
} from 'mongoose'

export const CommentSchema = new Schema(
  {
    recipeId: {
      type: Number,
      required: true,

      index: true,
    },

    authorId: {
      type: Number,
      required: true,

      index: true,
    },

    content: {
      type: String,

      required: true,

      trim: true,

      minlength: 1,

      maxlength: 2000,
    },
  },
  {
    timestamps: true,

    collection: 'comments',
  },
)

export type Comment = InferSchemaType<
  typeof CommentSchema
>

export const Comment = model(
  'Comment',
  CommentSchema,
)