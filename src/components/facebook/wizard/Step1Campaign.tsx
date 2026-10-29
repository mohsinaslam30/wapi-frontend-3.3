/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { OBJECTIVES } from "@/src/data/facebook";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import { useGetFacebookPagesQuery } from "@/src/redux/api/facebookApi";
import { useFormikContext } from "formik";
import { Info } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const Step1Campaign: React.FC = () => {
  const { t } = useTranslation();
  const { isFeatureEnabled } = useFeatureAccess();
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext<any>();

  const { data: pagesData, isLoading: isLoadingPages } =
    useGetFacebookPagesQuery({ limit: 100 });
  const facebookPages = pagesData?.data || [];

  useEffect(() => {
    if (!values?.fb_page_id && facebookPages.length > 0) {
      const defaultPage =
        facebookPages.find((p: any) => p.is_default) || facebookPages[0];
      if (defaultPage) {
        setFieldValue("fb_page_id", defaultPage._id);
      }
    }
  }, [facebookPages, values?.fb_page_id, setFieldValue]);

  const filteredObjectives = useMemo(() => {
    return OBJECTIVES.filter((obj) => {
      if (obj.value === "OUTCOME_LEADS") {
        return isFeatureEnabled("facebook_lead");
      }
      return true;
    });
  }, [isFeatureEnabled]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-primary dark:text-primary">
          <Info size={18} className="sm:w-5 sm:h-5" />
          <h2 className="text-lg sm:text-xl font-bold">{t("campaign_info")}</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t("campaign_info_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-2.5">
          <Label
            htmlFor="name"
            className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            {t("campaign_name")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder={t("enter_campaign_name")}
            value={values?.name || ""}
            onChange={(e) => setFieldValue("name", e.target.value)}
            onBlur={handleBlur}
            className={cn(
              "h-10 sm:h-11 bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base",
              touched.name && errors.name ? "border-red-500 bg-red-50/10" : "",
            )}
          />
          {touched.name && errors.name && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1 font-medium">
              {errors.name as string}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="objective"
            className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            {t("campaign_objective")} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={values?.objective || ""}
            onValueChange={(val) => setFieldValue("objective", val)}
          >
            <SelectTrigger
              className={cn(
                "h-10 sm:h-11 py-5 sm:py-5.5 mb-0! bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base",
                touched.objective && errors.objective
                  ? "border-red-500 bg-red-50/10"
                  : "",
              )}
            >
              <SelectValue placeholder={t("select_objective")} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)">
              {filteredObjectives.map((obj) => (
                <SelectItem
                  className="dark:hover:bg-(--table-hover) text-sm"
                  key={obj.value}
                  value={obj.value}
                >
                  {obj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.objective && errors.objective && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1 font-medium">
              {errors.objective as string}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="fb_page_id"
            className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            {t("facebook_page", "Facebook Page")} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={values?.fb_page_id || ""}
            onValueChange={(val) => setFieldValue("fb_page_id", val)}
          >
            <SelectTrigger
              className="h-10 sm:h-11 py-5 sm:py-5.5 mb-0! bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-2 focus:ring-primary/20 transition-all text-sm sm:text-base"
            >
              <SelectValue
                placeholder={
                  isLoadingPages
                    ? t("loading", "Loading pages...")
                    : t("select_facebook_page", "Select Facebook Page")
                }
              />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)">
              {facebookPages.map((pg: any) => (
                <SelectItem
                  className="dark:hover:bg-(--table-hover) text-sm"
                  key={pg._id || pg.page_id}
                  value={pg._id || pg.page_id}
                >
                  {pg.page_name}{" "}
                  {pg.is_default ? `(${t("default", "Default")})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <Label
            htmlFor="daily_budget"
            className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300"
          >
            {t("daily_budget")} ({t("amount_in_currency")}){" "}
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="daily_budget"
              name="daily_budget"
              type="number"
              min="1"
              step="any"
              placeholder="1"
              value={values?.daily_budget || ""}
              onChange={(e) => setFieldValue("daily_budget", e.target.value)}
              onBlur={handleBlur}
              className={cn(
                "h-10 sm:h-11 bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) focus:ring-2 focus:ring-primary/20 transition-all pl-10 text-sm sm:text-base",
                touched.daily_budget && errors.daily_budget
                  ? "border-red-500 bg-red-50/10"
                  : "",
              )}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm sm:text-base">
              $
            </span>
          </div>
          {touched.daily_budget && errors.daily_budget && (
            <p className="text-[10px] sm:text-xs text-red-500 mt-1 font-medium">
              {errors.daily_budget as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1Campaign;
