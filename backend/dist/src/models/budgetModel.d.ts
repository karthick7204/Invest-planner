import mongoose from 'mongoose';
export declare const budget: mongoose.Model<{
    limit: number;
    user: mongoose.Types.ObjectId;
    category: string;
    month: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    limit: number;
    user: mongoose.Types.ObjectId;
    category: string;
    month: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    limit: number;
    user: mongoose.Types.ObjectId;
    category: string;
    month: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    limit: number;
    user: mongoose.Types.ObjectId;
    category: string;
    month: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    limit: number;
    user: mongoose.Types.ObjectId;
    category: string;
    month: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    limit: number;
    user: mongoose.Types.ObjectId;
    category: string;
    month: string;
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
        limit: number;
        user: mongoose.Types.ObjectId;
        category: string;
        month: string;
    } & mongoose.DefaultTimestampProps, {
        id: string;
    }, mongoose.ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        limit: number;
        user: mongoose.Types.ObjectId;
        category: string;
        month: string;
    } & mongoose.DefaultTimestampProps & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    limit: number;
    user: mongoose.Types.ObjectId;
    category: string;
    month: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    limit: number;
    user: mongoose.Types.ObjectId;
    category: string;
    month: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=budgetModel.d.ts.map