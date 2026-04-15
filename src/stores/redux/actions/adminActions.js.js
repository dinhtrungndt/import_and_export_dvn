import { ExpenseService, InventoryService, OrderService, ProductService, ReportService } from '../../../services/apiService';
import {
    ADJUST_STOCK, ADJUST_STOCK_ERROR, CREATE_EXPENSE, CREATE_ORDER, CREATE_ORDER_ERROR, CREATE_PRODUCT,
    CREATE_PRODUCT_ERROR, CREATE_PRODUCT_SUCCESS, DELETE_EXPENSE, DELETE_PRODUCT, DELETE_PRODUCT_ERROR, FETCH_ALL_ORDERS,
    FETCH_ALL_ORDERS_ERROR, FETCH_EXPENSES, FETCH_EXPENSES_ERROR, FETCH_EXPENSES_SUCCESS, FETCH_EXPORT_REPORT,
    FETCH_EXPORT_REPORT_ERROR, FETCH_HIDDEN_EXPENSES, FETCH_HIDDEN_EXPENSES_ERROR, FETCH_HIDDEN_EXPENSES_SUCCESS, FETCH_INVENTORY_REPORT,
    FETCH_INVENTORY_REPORT_ERROR, FETCH_INVENTORY_TRANSACTIONS, FETCH_INVENTORY_TRANSACTIONS_ERROR, FETCH_ORDER_BY_ID,
    FETCH_ORDER_BY_ID_ERROR, FETCH_PRODUCTS, FETCH_PRODUCTS_ERROR, FETCH_PRODUCTS_HIDDEN, FETCH_PRODUCT_BY_ID,
    FETCH_PRODUCT_BY_ID_ERROR, FETCH_REPORTS_DASHBOARD, FETCH_REPORTS_DASHBOARD_ERROR, FETCH_REVENUE_REPORT,
    FETCH_REVENUE_REPORT_ERROR, FETCH_USER_ORDERS, FETCH_USER_ORDERS_ERROR, HIDE_EXPENSE, HIDE_PRODUCT,
    HIDE_PRODUCT_ERROR, IMPORT_STOCK, IMPORT_STOCK_ERROR, RESTORE_EXPENSE, RESTORE_PRODUCT, UPDATE_EXPENSE, UPDATE_ORDER_STATUS,
    UPDATE_ORDER_STATUS_ERROR, UPDATE_PRODUCT, UPDATE_PRODUCT_ERROR
} from './types';

export const setRestoringProduct = (id) => ({ type: 'SET_RESTORING_PRODUCT', payload: id });

export const fetchProducts = (params = {}) => async (dispatch) => {
    try {
        const apiParams = { ...params };
        const sortOption = params.sortOption;
        if (params.sortOption) {
            const [field, order] = params.sortOption.split('_');
            apiParams.sort = field; apiParams.order = order; delete apiParams.sortOption;
        }
        const data = await ProductService.getAllProducts(apiParams);
        dispatch({ type: FETCH_PRODUCTS, payload: data, meta: { sortOption } });
    } catch (error) {
        dispatch({ type: FETCH_PRODUCTS_ERROR, payload: error.response?.data || { message: 'Lỗi khi lấy dữ liệu sản phẩm' } });
    }
};

export const fetchProductById = (productId) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PRODUCT_BY_ID, meta: { loading: true } });
        const data = await ProductService.getProductById(productId);
        dispatch({ type: FETCH_PRODUCT_BY_ID, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_PRODUCT_BY_ID_ERROR, payload: error.response?.data || { message: 'Lỗi khi lấy chi tiết' } });
    }
};

export const hideProduct = (productId) => async (dispatch) => {
    try {
        dispatch({ type: HIDE_PRODUCT, meta: { loading: true } });
        await ProductService.hideProduct(productId);
        dispatch({ type: HIDE_PRODUCT, payload: productId });
        dispatch(fetchProducts());
    } catch (error) {
        dispatch({ type: HIDE_PRODUCT_ERROR, payload: error.response?.data || { message: 'Lỗi khi ẩn sản phẩm' } });
    }
};

export const fetchHiddenProducts = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_PRODUCTS_HIDDEN, payload: [], meta: { loading: true } });
        const data = await ProductService.getHiddenProducts();
        dispatch({ type: FETCH_PRODUCTS_HIDDEN, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_PRODUCTS_ERROR, payload: error.response?.data || { message: 'Lỗi khi lấy sản phẩm ẩn' } });
    }
};

export const fetchRestoreProducts = (id) => async (dispatch) => {
    try {
        dispatch(setRestoringProduct(id));
        const data = await ProductService.restoreProduct(id);
        dispatch({ type: RESTORE_PRODUCT, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_PRODUCTS_ERROR, payload: error.response?.data || { message: 'Lỗi khôi phục' } });
    } finally {
        dispatch(setRestoringProduct(null));
    }
};

export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_PRODUCT });
        const data = await ProductService.createProduct(productData);
        dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
        dispatch(fetchProducts());
    } catch (error) {
        dispatch({ type: CREATE_PRODUCT_ERROR, payload: error.response?.data || { message: 'Lỗi thêm sản phẩm' } });
    }
};

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        const data = await ProductService.updateProduct(id, productData);
        dispatch({ type: UPDATE_PRODUCT, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_PRODUCT_ERROR, payload: error.response?.data || { message: 'Lỗi cập nhật' } });
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        await ProductService.deleteProduct(id);
        dispatch({ type: DELETE_PRODUCT, payload: { id } });
    } catch (error) {
        dispatch({ type: DELETE_PRODUCT_ERROR, payload: error.response?.data || { message: 'Lỗi xóa' } });
    }
};

export const createOrder = (orderData) => async (dispatch) => {
    try {
        const data = await OrderService.createOrder(orderData);
        dispatch({ type: CREATE_ORDER, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_ORDER_ERROR, payload: error.response?.data || { message: 'Lỗi tạo đơn' } });
        throw error;
    }
};

export const fetchUserOrders = () => async (dispatch) => {
    try {
        const data = await OrderService.getUserOrders();
        dispatch({ type: FETCH_USER_ORDERS, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_USER_ORDERS_ERROR, payload: error.response?.data || { message: 'Lỗi lấy đơn' } });
    }
};

export const fetchOrderById = (id) => async (dispatch) => {
    try {
        const data = await OrderService.getOrderById(id);
        dispatch({ type: FETCH_ORDER_BY_ID, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_ORDER_BY_ID_ERROR, payload: error.response?.data || { message: 'Lỗi chi tiết đơn' } });
    }
};

export const fetchAllOrders = (params = {}) => async (dispatch) => {
    try {
        const data = await OrderService.getAllOrders(params);
        dispatch({ type: FETCH_ALL_ORDERS, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_ALL_ORDERS_ERROR, payload: error.response?.data || { message: 'Lỗi lấy danh sách đơn' } });
    }
};

export const updateOrderStatus = (id, status) => async (dispatch) => {
    try {
        const data = await OrderService.updateOrderStatus(id, status);
        dispatch({ type: UPDATE_ORDER_STATUS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_ORDER_STATUS_ERROR, payload: error.response?.data || { message: 'Lỗi cập nhật trạng thái' } });
    }
};

export const importStock = (importData) => async (dispatch) => {
    try {
        const data = await InventoryService.importStock(importData);
        dispatch({ type: IMPORT_STOCK, payload: data });
    } catch (error) {
        dispatch({ type: IMPORT_STOCK_ERROR, payload: error.response?.data || { message: 'Lỗi nhập kho' } });
    }
};

export const adjustStock = (adjustData) => async (dispatch) => {
    try {
        const data = await InventoryService.adjustStock(adjustData);
        dispatch({ type: ADJUST_STOCK, payload: data });
    } catch (error) {
        dispatch({ type: ADJUST_STOCK_ERROR, payload: error.response?.data || { message: 'Lỗi điều chỉnh tồn kho' } });
    }
};

export const fetchInventoryTransactions = (params = {}) => async (dispatch) => {
    try {
        const data = await InventoryService.getInventoryTransactions(params);
        dispatch({ type: FETCH_INVENTORY_TRANSACTIONS, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_INVENTORY_TRANSACTIONS_ERROR, payload: error.response?.data || { message: 'Lỗi lịch sử giao dịch kho' } });
    }
};

export const fetchReportDashboard = () => async (dispatch) => {
    try {
        const data = await ReportService.getDashboardReport();
        dispatch({ type: FETCH_REPORTS_DASHBOARD, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_REPORTS_DASHBOARD_ERROR, payload: error.message || 'Lỗi báo cáo tổng quan' });
    }
};

export const fetchInventoryReport = (params = {}) => async (dispatch) => {
    try {
        const data = await ReportService.getInventoryReport(params);
        dispatch({ type: FETCH_INVENTORY_REPORT, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_INVENTORY_REPORT_ERROR, payload: error.message || 'Lỗi báo cáo tồn kho' });
    }
};

export const fetchRevenueReport = (params = {}) => async (dispatch) => {
    try {
        const data = await ReportService.getRevenueReport(params);
        dispatch({ type: FETCH_REVENUE_REPORT, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_REVENUE_REPORT_ERROR, payload: error.message || 'Lỗi báo cáo doanh thu' });
    }
};

export const fetchExportReport = (params = {}) => async (dispatch) => {
    try {
        const data = await ReportService.getExportReport(params);
        dispatch({ type: FETCH_EXPORT_REPORT, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_EXPORT_REPORT_ERROR, payload: error.message || 'Lỗi báo cáo xuất kho' });
    }
};

export const fetchExpenseReport = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_EXPENSES, meta: { loading: true } });
        const data = await ReportService.getExpenseReport(params);
        dispatch({
            type: FETCH_EXPENSES,
            payload: {
                ...data,
                totalAmount: data.total?.amount || 0,
            },
        });
    } catch (error) {
        dispatch({ type: FETCH_EXPENSES_ERROR, payload: error.response?.data || { message: 'Lỗi báo cáo chi phí' } });
    }
};

export const fetchExpenses = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_EXPENSES, meta: { loading: true } });
        const data = await ExpenseService.getExpenses(params);
        dispatch({ type: FETCH_EXPENSES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_EXPENSES_ERROR, payload: error.response?.data || { message: 'Lỗi danh sách chi phí' } });
    }
};

export const fetchHiddenExpenses = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: FETCH_HIDDEN_EXPENSES, meta: { loading: true } });
        const data = await ExpenseService.getHiddenExpenses(params);
        dispatch({ type: FETCH_HIDDEN_EXPENSES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_HIDDEN_EXPENSES_ERROR, payload: error.response?.data || { message: 'Lỗi danh sách chi phí ẩn' } });
    }
};

export const createExpense = (expenseData) => async (dispatch) => {
    try {
        const data = await ExpenseService.createExpense(expenseData);
        dispatch({ type: CREATE_EXPENSE, payload: data });
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi tạo chi phí' };
    }
};

export const updateExpense = (id, expenseData) => async (dispatch) => {
    try {
        const data = await ExpenseService.updateExpense(id, expenseData);
        dispatch({ type: UPDATE_EXPENSE, payload: { id, data } });
        return data;
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi cập nhật chi phí' };
    }
};

export const deleteExpense = (id) => async (dispatch) => {
    try {
        await ExpenseService.deleteExpense(id);
        dispatch({ type: DELETE_EXPENSE, payload: id });
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi xóa chi phí' };
    }
};

export const hideExpense = (id) => async (dispatch) => {
    try {
        await ExpenseService.hideExpense(id);
        dispatch({ type: HIDE_EXPENSE, payload: id });
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi ẩn chi phí' };
    }
};

export const restoreExpense = (id) => async (dispatch) => {
    try {
        await ExpenseService.restoreExpense(id);
        dispatch({ type: RESTORE_EXPENSE, payload: id });
    } catch (error) {
        throw error.response?.data || { message: 'Lỗi khôi phục chi phí' };
    }
};
