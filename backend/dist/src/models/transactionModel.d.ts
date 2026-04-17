import mongoose from "mongoose";
export declare const transaction: mongoose.Model<{
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    topic: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    topic: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    topic: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    topic: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    topic: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    topic: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        type: "expense" | "income";
        date: NativeDate;
        user: mongoose.Types.ObjectId;
        amount: number;
        category: string;
        topic: string;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        type: "expense" | "income";
        date: NativeDate;
        user: mongoose.Types.ObjectId;
        amount: number;
        category: string;
        topic: string;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    topic: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    amount: number;
    category: string;
    topic: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=transactionModel.d.ts.map