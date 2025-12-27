import mongoose from "mongoose";
export declare const income: mongoose.Model<{
    user?: mongoose.Types.ObjectId | null;
    income?: number | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user?: mongoose.Types.ObjectId | null;
    income?: number | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    user?: mongoose.Types.ObjectId | null;
    income?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    user?: mongoose.Types.ObjectId | null;
    income?: number | null;
}, mongoose.Document<unknown, {}, {
    user?: mongoose.Types.ObjectId | null;
    income?: number | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    user?: mongoose.Types.ObjectId | null;
    income?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        user?: mongoose.Types.ObjectId | null;
        income?: number | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        user?: mongoose.Types.ObjectId | null;
        income?: number | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    user?: mongoose.Types.ObjectId | null;
    income?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user?: mongoose.Types.ObjectId | null;
    income?: number | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=incomeModel.d.ts.map