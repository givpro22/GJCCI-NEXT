export function HeroSection() {
  return (
    <section className="py-10 text-center">
      <>
        <img
          src="./og-image.png"
          alt="광주상공회의소 타이머"
          className="h-18 mx-auto mb-4"
        />
        <h1 className="text-primary text-3xl font-extrabold tracking-tight">
          광주상공회의소 부감독 맞춤 시간 도구
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-300">
          시험 시간 진행에 따라 화면이 번쩍이는 알림을 제공합니다: 절반 남았을
          때 <span className="font-semibold text-blue-500">파란색</span>, 1분
          30초 남았을 때{" "}
          <span className="font-semibold text-green-500">초록색</span>, 시간이
          끝났을 때 <span className="font-semibold text-red-500">빨간색</span>
          으로 표시됩니다.
        </p>
      </>
    </section>
  );
}
