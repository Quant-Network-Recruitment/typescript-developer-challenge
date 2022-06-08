import { Collection, Db, WithId } from 'mongodb';
import TemplateType from '../types/TemplateType';

class TemplateRepository {
  db: Db;
  collection: Collection<TemplateType>;
  private COLLECTION_NAME = "templateType";

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection(this.COLLECTION_NAME);
  }

  async findTemplateTypeById(id: string): Promise<WithId<TemplateType> | null> {
    return this.collection.findOne({
      id: id,
    });
  }

  async findTemplateTypeByTemplateField(templateField: string): Promise<WithId<TemplateType> | null> {
    return this.collection.findOne({
      templateField: templateField,
    });
  }

  async save(TemplateType: TemplateType): Promise<void> {
    await this.collection.insertOne(TemplateType);
  }
}

export default TemplateRepository;