import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams, Link } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import CourseCard from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import PremiumLoader from '../components/common/PremiumLoader';
import Reveal from '../components/common/Reveal';
import GradientOrbs from '../components/common/GradientOrbs';

const Catalog = () => {
    const { loading } = useSelector((state) => state.profile)
    const { catalogName } = useParams()
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [categoryNameTitle, setCategoryNameTitle] = useState("");
    const [pageLoading, setPageLoading] = useState(true);

    // Fetch all categories and find matching category ID
    useEffect(() => {
        const getCategories = async () => {
            setPageLoading(true);
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                const matchingCategory = res?.data?.data?.find(
                    (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName?.toLowerCase()
                );
                if (matchingCategory?._id) {
                    setCategoryId(matchingCategory._id);
                    setCategoryNameTitle(matchingCategory.name);
                } else {
                    setCategoryId("");
                }
            } catch (error) {
                console.log("Could not fetch categories", error);
            }
            setPageLoading(false);
        }
        if (catalogName) {
            getCategories();
        }
    }, [catalogName]);

    useEffect(() => {
        const getCategoryDetails = async () => {
            setPageLoading(true);
            try {
                const res = await getCatalogaPageData(categoryId);
                setCatalogPageData(res);
            } catch (error) {
                console.log(error);
            }
            setPageLoading(false);
        }
        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);

    if (loading || pageLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <PremiumLoader size="lg" />
            </div>
        )
    }

    if (!catalogPageData || !catalogPageData.success) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-between">
                <div className="mx-auto flex flex-col items-center justify-center gap-4 py-20 text-center px-4">
                    <h2 className="text-3xl font-bold text-richblack-5">Category Not Found</h2>
                    <p className="text-richblack-300 max-w-[500px]">
                        We couldn't find details for category "{categoryNameTitle || catalogName}". Explore other categories or browse all courses.
                    </p>
                    <Link
                        to="/"
                        className="mt-4 rounded-xl bg-edupurple-50 px-6 py-3 font-semibold text-richblack-900 shadow-glow transition-all hover:scale-95"
                    >
                        Back to Home
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const selectedCourses =
        catalogPageData?.data?.selectedCategory?.courses ||
        catalogPageData?.data?.selectedCategory?.course ||
        [];

    const differentCategoryData =
        catalogPageData?.data?.differentCategory ||
        catalogPageData?.data?.differentCategories?.[0] ||
        null;

    const differentCourses =
        differentCategoryData?.courses ||
        differentCategoryData?.course ||
        [];

    const mostSelling =
        catalogPageData?.data?.mostSellingCourses ||
        catalogPageData?.data?.topSellingCourses ||
        [];

    return (
        <>
            {/* Hero Section */}
            <div className="relative overflow-hidden box-content bg-richblack-800 px-4 py-8">
                <GradientOrbs />
                <div className="mx-auto flex min-h-[200px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
                    <p className="text-sm text-richblack-300">
                        {`Home / Catalog / `}
                        <span className="text-edupurple-25 font-semibold">
                            {catalogPageData?.data?.selectedCategory?.name || categoryNameTitle}
                        </span>
                    </p>
                    <h1 className="text-3xl font-bold text-richblack-5">
                        {catalogPageData?.data?.selectedCategory?.name || categoryNameTitle}
                    </h1>
                    <p className="max-w-[870px] text-richblack-200">
                        {catalogPageData?.data?.selectedCategory?.description || "Explore top quality courses and expand your skillset."}
                    </p>
                </div>
            </div>

            {/* Section 1 - Courses to get started */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <Reveal>
                    <div className="section_heading">Courses to get you started</div>
                </Reveal>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 ${
                            active === 1
                                ? "border-b border-b-edupurple-25 text-edupurple-25 font-semibold"
                                : "text-richblack-50"
                        } cursor-pointer transition-colors`}
                        onClick={() => setActive(1)}
                    >
                        Most Popular
                    </p>
                    <p
                        className={`px-4 py-2 ${
                            active === 2
                                ? "border-b border-b-edupurple-25 text-edupurple-25 font-semibold"
                                : "text-richblack-50"
                        } cursor-pointer transition-colors`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p>
                </div>
                <div>
                    <CourseSlider Courses={selectedCourses} />
                </div>
            </div>

            {/* Section 2 - Different Category */}
            {differentCategoryData && differentCourses.length > 0 && (
                <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <Reveal>
                        <div className="section_heading">
                            Top courses in {differentCategoryData?.name}
                        </div>
                    </Reveal>
                    <div className="py-8">
                        <CourseSlider Courses={differentCourses} />
                    </div>
                </div>
            )}

            {/* Section 3 - Frequently Bought */}
            {mostSelling.length > 0 && (
                <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <Reveal>
                        <div className="section_heading">Frequently Bought</div>
                    </Reveal>
                    <div className="py-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {mostSelling.slice(0, 4).map((course, i) => (
                                <CourseCard course={course} key={i} Height={"h-[400px]"} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    )
}

export default Catalog