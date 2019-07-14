export interface CheckboxModel {
  id: number;
  name: string;
  is_selected: boolean;
}

export interface PrimitiveCheckboxModel extends CheckboxModel {
  is_super_primitive: boolean;
}
