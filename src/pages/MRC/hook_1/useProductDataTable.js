import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import {
    InputLabel,
    Icon,
    Button,
    Grid,
    Select,
    Radio,
    RadioGroup,
    FormControl,
    IconButton,
    MenuItem,
    TextField,
    CircularProgress,
    FormHelperText,
  } from "@material-ui/core";
import useItemDropdown from "./useItemDropdown";
import Controls from "../../../components/Controls/Controls";
import { dropdownFunction } from "../../../utils/dropdownFunction";

const useProductDataTable = (updateData, formik, setDeleteProductID, setShowDeleteProductModal) => {
    const addProductOnChange = (e, i, fieldName) => {
        formik.setFieldValue(`return_items[${i}].${fieldName}`, e?.value || e?.target?.value);
    };

    const { productDropdown, setProductDropdown, brandDropdown, setBrandDropdown, stockList, brandList} = useItemDropdown();

    const modalTableColumns = [
        {
            field: "stock",
            header: "Stock",
            sortableBody: (value, event) => (
                <div className="w-50">
                    <Controls.Select
                        name="stock"
                        autoFilteredValue={productDropdown}
                        autoCompleteMethod={(event) => dropdownFunction(event, setProductDropdown, stockList)}
                        onChange={(e) => addProductOnChange(e, event.rowIndex, "stock")}
                        value={formik.values.return_items[event.rowIndex]?.stock}
                        onBlur={formik.handleBlur}
                        options={stockList}
                        error={formik.touched.stock && Boolean(formik.errors.stock)}
                        helperText={formik.touched.stock && formik.errors.stock}
                    />
                </div>
            ),
        },
        {
            field: "remain_quantity",
            header: "Remain Quantity",
            sortableBody: (value, event) => (
                <div className="w-25">
                    <Controls.Input
                        id="remain_quantity"
                        name="remain_quantity"
                        onChange={(e) => addProductOnChange(e, event.rowIndex, "remain_quantity")}
                        value={formik.values.return_items[event.rowIndex]?.stock?.remain_quantity}
                        type="number"
                        width="full"
                        autoCompleteFieldName="remain_quantity"
                        required={true}
                        disabled
                        messagePosition='bottom'
                        errors={formik.errors.return_items?.[event.rowIndex]?.stock?.remain_quantity}
                    />
                </div>
            ),
        },
    ]

    const deleteRequisitionItems = (rowData) => {
        const {id, return_instance} = rowData;
        setDeleteProductID({id, return_instance})
        setShowDeleteProductModal(true)
    }

    const modalTableActionButton = (rowData, {rowIndex}) => {
        const handleOnFieldIncrement = () => {
            const joinData = formik.values.return_items.concat({
                fieldId: rowIndex + 1,
                stock: "",
                brand: "",
                stock_quantity: "",
            });
            formik.setFieldValue("return_items", joinData)
        };

        const handleOnFieldDecrement = (i) => {
            if(rowData.id > 0){
                return deleteRequisitionItems(rowData)
            }
            const removeData = [...formik.values.return_items];
            removeData.splice(rowIndex, 1);
            formik.setFieldValue("return_items", removeData);
        };

        return (
            <>
                <div className="flex items-center justify-center">
                    {
                        formik.values.return_items.length - 1 === rowIndex ? (
                            <>
                                <Button 
                                    icon={<AddIcon className="text-green-700 text-2xl" />}
                                    className="p-button-rounded p-mr-2 action-button-green"
                                    title=""
                                    type="button"
                                    onClick={handleOnFieldIncrement}
                                />
                                {formik.values.return_items.length !== 1 && 
                                <Button 
                                    icon={<DeleteIcon className="text-red-700 text-2xl" />} 
                                    className="p-button-rounded p-mr-2 action-button-red" 
                                    title="" 
                                    type="button" 
                                    onClick={handleOnFieldDecrement} 
                                />}
                            </>
                        ) : 
                        (
                            <>
                                <Button 
                                    icon={<DeleteIcon className="text-red-700 text-2xl" />} 
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

export default useProductDataTable