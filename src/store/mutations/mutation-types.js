/**
 * 公共更新state的方法
 */
export const commonUpdate = 'commonMutationsUpdate'
/**
 * 公共获取state参数的方法
 */
export const commonGet = 'commonGet'

/*********animation下的store***************/

/**
 * animation命名空间
 */
export const animationSpace = 'animation'

/**
 * 更新整个animation state数据
 */
export const updateAnimationParams = 'updateAnimationParams'



/*********page下的store***************/

/**
 * page命名空间
 */
export const pageSpace = 'page'

/**
 *  添加fabric的object对象
 */
export const addObj = 'addObject'

/**
 * 删除fabric的object对象
 */
export const delObj = 'deleteObject'

/**
 * 设置当前的选中的对象
 */
export const setSelectObj = 'setSelectedObjects'

/**
 * 更新当前的fabric对象
 */
export const updateObjs = 'updateCurPageObjects'

/**
 * 设置当前curPage的数据
 */
export const setCurPage = 'setCurPage'

/**
 * 设置当前curPage的数据
 */
export const setCurPlayScreenPage = 'setCurPlayScreenPage'

/**
 * 添加场景页
 */
export const addPage = 'addPage'

/**
 * 更新场景页
 */
export const updatePages = 'updatePages'

/**
 * 删除场景页
 */
export const deletePage = 'deletePage'


/**
 * 更新animation排序
 */
export const changeAnimationOrder = 'changeAnimationOrder'

/**
 * 更新page中的animation参数
 */
export const updateAnimation = 'updateAnimation'

/**************common模块********/

/** */
/**
 * common命名空间
 */
export const commonSpace = 'common'

/**
 * 更新ContextMenuType
 */
export const updateC_Menu = 'updateContextMenuType'

/**
 * 批量同步更新多个数据
 */
export const updateBatchState = 'updateBatchState'

/**
 * 更新大屏websocket状态
 */
export const updateShowWsStatus = 'updateShowWsStatus'

/*****************symbols模块***************** */

/**
 * symbols命名空间
 */
export const symbolSpace = 'symbols'

/**
 * 添加元件
 */
export const addSymbolTemp = 'addSymbolTemp'

/**
 * 图表设置子组件更新
 */
export const updateChartItem = 'updateChartItem';

/**
 * 针对部分拦截store不方便处理数据的操作, 手动更新history
 * 例: 删除页
 */
export const storeHistory = 'storeHistory';

/**
 * 设置当前页id,不刷新canvas
 */

export const setCurPageId = 'setCurPageId';

/**
 * 设置 pages 的数据
 */

export const storePagesNewData = 'storePagesNewData';

