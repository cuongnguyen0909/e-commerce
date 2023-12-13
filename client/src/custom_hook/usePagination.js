import { useMemo } from 'react';
import { generateRange } from '../ultils/helpers';
import icons from '../ultils/icons';

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
    const { BiDotsHorizontalRounded } = icons
    //siblingCount la so luong pagination item o 2 ben trai va phai cua current page
    //totalProductCount la tong so luong san pham
    //currentPage la trang hien tai

    const paginationArray = useMemo(() => {
        const pageSize = process.env.REACt_APP_LIMIT || 10;
        const paginationCount = Math.ceil(totalProductCount / pageSize);
        const totalPaginationItem = siblingCount + 5;

        if (paginationCount <= totalPaginationItem) return generateRange(1, paginationCount);

        //isShowleft la trang hien tai lon hon 2 + so luong pagination item o 2 ben trai
        //ishowright la trang hien tai nho hon tong so luong pagination - 2 - so luong pagination item o 2 ben phai
        const isShowLeft = currentPage > siblingCount + 2;
        const isShowRight = currentPage < paginationCount - siblingCount - 1;

        if (isShowLeft && !isShowRight) {
            const rightStart = paginationCount - 4;
            const rightRange = generateRange(rightStart, paginationCount);

            return [1, <BiDotsHorizontalRounded />, ...rightRange]
        }

        if (!isShowLeft && isShowRight) {
            const leftRange = generateRange(1, 5);
            return [...leftRange, <BiDotsHorizontalRounded />, paginationCount];

        }

        const siblingLeft = Math.max(currentPage - siblingCount, 1);
        const siblingRight = Math.min(currentPage + siblingCount, paginationCount);
        if (isShowLeft && isShowRight) {
            const middleRange = generateRange(siblingLeft, siblingRight);
            return [1, <BiDotsHorizontalRounded />, ...middleRange, '...', paginationCount]
        }

    }, [totalProductCount, currentPage, siblingCount])


    return paginationArray;
}

export default usePagination