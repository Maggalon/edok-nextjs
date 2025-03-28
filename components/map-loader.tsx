import Script from "next/script";

const MAP_API_KEY = process.env.NEXT_PUBLIC_YANDEX_TOKEN

export const YMapLoader = () => {
    return (
        <>
            <Script
                src={`https://api-maps.yandex.ru/3.0/?apikey=${MAP_API_KEY}&lang=en_US`}
                type="module"
                strategy="beforeInteractive"
            />
        </>
    )
}