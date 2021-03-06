import { map } from "lodash";
import capitalize from "lodash/capitalize";

// Route-related
import { mainPage } from "routes";

// Types
import { IPath } from "types/types";

const capitalizeFirstLetterOfEachWord = (str: string): string => {
    const splitStr = str.split(" "); // ["this", "is", "a"];
    const newSplitStr = map(splitStr, capitalize);
    return newSplitStr.join(" ");
}

export const cleanKebabString = (str: string): string => {
    // Removes hyphen on strings.
    const strRemovedDashes = str.replaceAll("-", " ");
    return capitalizeFirstLetterOfEachWord(strRemovedDashes);
};

export const removeAllSlashes = (str: string): string => {
    return str.replaceAll("/", "");
}

export const getRandomElementFromArray = (arr: any[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Route-related
export const isNotMainRoute = (pathName: string): boolean => {
    if (pathName !== mainPage) return true;
    return false;
};

export const getOnlyGameRoutes = (allRoutes: IPath[], exceptionRoutes: string[]): IPath[] => {
    const onlyGameRoutes = allRoutes.filter(route => {
        return exceptionRoutes.every(exceptionRoute => exceptionRoute !== route.name)
    })
    return onlyGameRoutes;
}