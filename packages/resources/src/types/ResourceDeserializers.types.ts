export interface SerializedValueTypes {
  date: unknown;
}

export interface ResourceDeserializers<
  TSerializedValueTypes extends SerializedValueTypes = SerializedValueTypes,
> {
  date(value: TSerializedValueTypes['date']): Date;
}
