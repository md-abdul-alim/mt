import { InputField } from "components/InputField/Input";
import { CommonButton } from "components/Buttons/Buttons";
import { BiMinus, BiPlus } from "react-icons/bi";
import useItemDropdown from "./useItemDropdown";
import { dropdownFunction } from "utilities/dropdownFunction";

const useChallanItemDataTable = (formik, setDeleteItemID, setShowDeleteItemModal) => {
    const addItemOnChange = (e, i, fieldName) => {
        formik.setFieldValue(`challan_items[${i}].${fieldName}`, e?.value || e?.target?.value);
    };

    const {
        itemDropdown, 
        setItemDropdown, 
        uomDropdown,
        setUomDropdown,
        itemList,
        umoList,
    } = useItemDropdown();

    const modalTableColumns = [
        {
            field: "item",
            header: "Item",
            sortableBody: (value, event) => (
                <div className="w-50">
                    <InputField
                        id="item"
                        name="item"
                        autoFilteredValue={itemDropdown}
                        autoCompleteMethod={(event) => dropdownFunction(event, setItemDropdown, itemList)}
                        onChange={(e) => addItemOnChange(e, event.rowIndex, "item")}
                        value={formik.values.challan_items[event.rowIndex]?.item}
                        type="select"
                        label="Select Item"
                        width="full"
                        autoCompleteFieldName="name"
                        required={true}
                        errors={formik.errors.challan_items?.[event.rowIndex]?.item?.id}
                    />
                </div>
            ),
        },
        {
            field: "purpose",
            header: "Purpose",
            sortableBody: (value, event) => (
                <div className="w-25">
                    <InputField 
                        id="purpose"
                        name="purpose"
                        onChange={(e) => addItemOnChange(e, event.rowIndex, "purpose")}
                        value={formik.values.challan_items[event.rowIndex]?.purpose}
                        type="textarea"
                        width="full"
                        autoCompleteFieldName="purpose"
                        required={false}
                        messagePosition='bottom'
                        errors={formik.errors.challan_items?.[event.rowIndex]?.purpose}
                    />
                </div>
            ),
        },
        {
            field: "quantity",
            header: "Quantity",
            sortableBody: (value, event) => (
                <div className="w-25">
                    <InputField 
                        id="quantity"
                        name="quantity"
                        onChange={(e) => addItemOnChange(e, event.rowIndex, "quantity")}
                        value={formik.values.challan_items[event.rowIndex]?.quantity}
                        type="numbers"
                        width="full"
                        autoCompleteFieldName="quantity"
                        required={true}
                        messagePosition='bottom'
                        errors={formik.errors.challan_items?.[event.rowIndex]?.quantity}
                    />
                </div>
            ),
        },
        {
            field: "uom",
            header: "UOM",
            sortableBody: (value, event) => (
                <div className="w-50">
                    <InputField
                        id="uom"
                        name="uom"
                        autoFilteredValue={uomDropdown}
                        autoCompleteMethod={(event) => dropdownFunction(event, setUomDropdown, umoList)}
                        onChange={(e) => addItemOnChange(e, event.rowIndex, "uom")}
                        value={formik.values.challan_items[event.rowIndex]?.uom}
                        type="select"
                        label="Select Uom"
                        width="full"
                        autoCompleteFieldName="name"
                        required={true}
                        errors={formik.errors.challan_items?.[event.rowIndex]?.uom?.id}
                    />
                </div>
            ),
        },
        {
            field: "remark",
            header: "Remark",
            sortableBody: (value, event) => (
                <div className="w-25">
                    <InputField 
                        id="remark"
                        name="remark"
                        onChange={(e) => addItemOnChange(e, event.rowIndex, "remark")}
                        value={formik.values.challan_items[event.rowIndex]?.remark}
                        type="text"
                        width="full"
                        autoCompleteFieldName="remark"
                        required={false}
                        messagePosition='bottom'
                        errors={formik.errors.challan_items?.[event.rowIndex]?.remark}
                    />
                </div>
            ),
        },
    ]

    const deleteChallantems = (rowData) => {
        const {id, chalan} = rowData;
        setDeleteItemID({id, chalan})
        setShowDeleteItemModal(true)
    }

    const modalTableActionButton = (rowData, {rowIndex}) => {
        const handleOnFieldIncrement = () => {
            const joinData = formik.values.challan_items.concat({
                fieldId: rowIndex + 1,
                item: "",
                purpose: "",
                quantity: 1,
                uom: "",
                remark: "",
            });
            formik.setFieldValue("challan_items", joinData)
        };

        const handleOnFieldDecrement = (i) => {
            if(rowData.id > 0){
                return deleteChallantems(rowData)
            }
            const removeData = [...formik.values.challan_items];
            removeData.splice(rowIndex, 1);
            formik.setFieldValue("challan_items", removeData);
        };

        return (
            <>
                <div className="flex items-center justify-center">
                    {
                        formik.values.challan_items.length - 1 === rowIndex ? (
                            <>
                                <CommonButton 
                                    icon={<BiPlus className="text-green-700 text-2xl" />}
                                    className="p-button-rounded p-mr-2 action-button-green"
                                    title=""
                                    type="button"
                                    onClick={handleOnFieldIncrement}
                                />
                                {formik.values.challan_items.length !== 1 && 
                                <CommonButton 
                                    icon={<BiMinus className="text-red-700 text-2xl" />} 
                                    className="p-button-rounded p-mr-2 action-button-red" 
                                    title="" 
                                    type="button" 
                                    onClick={handleOnFieldDecrement} 
                                />}
                            </>
                        ) : 
                        (
                            <>
                                <CommonButton 
                                    icon={<BiMinus className="text-red-700 text-2xl" />} 
                                    className="p-button-rounded p-mr-2 action-button-red" 
                                    title="" 
                                    type="button" 
                                    onClick={handleOnFieldDecrement} 
                                />
                            </>
                        )
                    }
                </div>
            </>
        )
    }

    return {
        modalTableColumns,
        modalTableActionButton,
    }
}

export default useChallanItemDataTable