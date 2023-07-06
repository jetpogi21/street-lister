//Generated by GetCompleteNextAuthModelFile
import { models } from "@auth/sequelize-adapter";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/db";
//Generated by GetRelationshipImports

export default interface VerificationToken
  extends Model<
    InferAttributes<VerificationToken>,
    InferCreationAttributes<VerificationToken>
  > {
  token: string;
  identifier?: string;
  expires: Date;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const VerificationToken = sequelize.define<VerificationToken>(
  "verificationToken",
  {
    ...models.VerificationToken,
    //Generated by GetModelFieldsDictionary
    userId: {
      type: DataTypes.UUID,
      field: "user_id",
    },
    identifier: {
      ...models.VerificationToken.identifier,
      allowNull: true,
    },
  },
  {
    name: { singular: "VerificationToken", plural: "VerificationTokens" },
    tableName: "verification_tokens",
  }
);

//Generated by GetRelationshipDeclarations

export const VerificationTokenSync = async () => {
  try {
    await VerificationToken.sync({ alter: true });
    console.log("VerificationToken table has been created!");
  } catch (error) {
    console.error(
      `Unable to create ${"VerificationToken".toLowerCase()} table:`,
      error
    );
  }
};