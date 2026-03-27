import mongoose from "mongoose";
export declare const transaction: mongoose.Model<{
    amount: number;
    category: string;
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    topic: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    amount: number;
    category: string;
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    topic: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    amount: number;
    category: string;
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
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
    amount: number;
    category: string;
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    topic: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    amount: number;
    category: string;
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    topic: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    amount: number;
    category: string;
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
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
        amount: number;
        category: string;
        type: "expense" | "income";
        date: NativeDate;
        user: mongoose.Types.ObjectId;
        topic: string;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        amount: number;
        category: string;
        type: "expense" | "income";
        date: NativeDate;
        user: mongoose.Types.ObjectId;
        topic: string;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    amount: number;
    category: string;
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    topic: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    amount: number;
    category: string;
    type: "expense" | "income";
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    topic: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=transactionModel.d.ts.map