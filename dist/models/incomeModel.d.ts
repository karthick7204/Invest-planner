import mongoose from "mongoose";
export declare const income: mongoose.Model<{
    user: string;
    income: number;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    user: string;
    income: number;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    user: string;
    income: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    user: string;
    income: number;
}, mongoose.Document<unknown, {}, {
    user: string;
    income: number;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    user: string;
    income: number;
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
        user: string;
        income: number;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        user: string;
        income: number;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    user: string;
    income: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    user: string;
    income: number;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=incomeModel.d.ts.map