/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Send } from "lucide-react";
import api from "@/services/api";

const ReviewModal = ({ reservation, formatDate, getServiceTypeBadge }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Silakan berikan rating terlebih dahulu");
      return;
    }

    if (!comment.trim()) {
      alert("Silakan tulis komentar Anda");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/reviews", {
        reservationId: reservation.id,
        rating: rating,
        comment: comment.trim(),
      });

      alert("Review berhasil ditambahkan!");
      setIsOpen(false);
      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment("");

      // Refresh halaman atau update state parent jika diperlukan
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal menambahkan review";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex) => {
    setHoverRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Sangat Buruk";
      case 2:
        return "Buruk";
      case 3:
        return "Cukup";
      case 4:
        return "Baik";
      case 5:
        return "Sangat Baik";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={reservation.status !== "success"}
        >
          <Star className="h-4 w-4 mr-1" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Berikan Penilaian
          </DialogTitle>
          <DialogDescription>
            Bagikan pengalaman Anda tentang layanan yang telah diberikan
          </DialogDescription>
        </DialogHeader>

        {/* Reservation Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-sm">
                {formatDate(reservation.date)} • {reservation.time}
              </p>
              <p className="text-sm text-gray-600">
                {reservation.Vehicle.brand} {reservation.Vehicle.type} (
                {reservation.Vehicle.productionYear})
              </p>
            </div>
            {getServiceTypeBadge(reservation.serviceType)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {(rating > 0 || hoverRating > 0) && (
              <p className="text-sm text-gray-600">
                {getRatingText(hoverRating || rating)}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Komentar *</label>
            <Textarea
              placeholder="Ceritakan pengalaman Anda dengan layanan yang diberikan..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              {comment.length}/500 karakter
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Kirim Review
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
