import { Art } from "@/components/illustrations";
import { HandText } from "@/components/sketch/HandText";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container notfound">
      <Art name="steam" className="notfound__art draw-in" />
      <h1>
        <HandText text="Oops, empty cup" seed={7} />
      </h1>
      <p>این صفحه پیدا نشد. شاید آدرس اشتباه تایپ شده باشد.</p>
      <div className="notfound__actions">
        <Button href="/">صفحه‌ی اصلی</Button>
        <Button href="/menu" variant="ghost">
          دیدن منو
        </Button>
      </div>
    </div>
  );
}
