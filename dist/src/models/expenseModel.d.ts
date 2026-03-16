import mongoose from 'mongoose';
export declare const expense: mongoose.Model<{
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    purpose: string;
    amount: number;
    category: string;
    time?: number | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    purpose: string;
    amount: number;
    category: string;
    time?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    purpose: string;
    amount: number;
    category: string;
    time?: number | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    purpose: string;
    amount: number;
    category: string;
    time?: number | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    purpose: string;
    amount: number;
    category: string;
    time?: number | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    purpose: string;
    amount: number;
    category: string;
    time?: number | null;
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
        date: NativeDate;
        user: mongoose.Types.ObjectId;
        purpose: string;
        amount: number;
        category: string;
        time?: number | null;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        date: NativeDate;
        user: mongoose.Types.ObjectId;
        purpose: string;
        amount: number;
        category: string;
        time?: number | null;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    purpose: string;
    amount: number;
    category: string;
    time?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    date: NativeDate;
    user: mongoose.Types.ObjectId;
    purpose: string;
    amount: number;
    category: string;
    time?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=expenseModel.d.ts.map