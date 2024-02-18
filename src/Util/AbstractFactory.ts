
export abstract class AbstractFactory<TEnum, TType> {

    public abstract get(type : TEnum, params : any[]) : TType;
}