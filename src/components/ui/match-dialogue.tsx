import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Linkedin, Twitter } from "lucide-react";
import { M_PLUS_1p } from "next/font/google";
import { User, ContactInfo } from "../../types";

const mPlus1p = M_PLUS_1p({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700']
});

interface MatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUser: User | null
  matchedUser: User | null
  onContinueSwiping?: () => void;
  onStartChat?: () => void;
}

export default function MatchDialog({
  open,
  onOpenChange,
  currentUser,
  matchedUser
}: MatchDialogProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      if (!open || !matchedUser || !matchedUser.id) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/user/${matchedUser.id}/contactInfo`);
        setContactInfo(response.data.contactInfo);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setContactInfo(matchedUser.contactInfo || null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactInfo();
  }, [open, matchedUser]);

  if (!matchedUser || !currentUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-xl shadow-lg p-0 ${mPlus1p.className}`}>
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-center text-white/90" style={{ fontWeight: 700 }}>
            It&apos;s a Match! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-blue-300" style={{ fontWeight: 400 }}>
            You and {matchedUser.name} have liked each other
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <div className="relative">
            {matchedUser.avatarUrl ? (
              <img
                src={matchedUser.avatarUrl}
                alt={matchedUser.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/40"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-900/30 to-indigo-900/20 flex items-center justify-center border-4 border-blue-500/40">
                <span className="text-4xl font-bold text-blue-300">
                  {matchedUser.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs py-1 px-3 rounded-full bg-blue-500/40 text-white shadow font-medium">
              New Match!
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg text-white/85" style={{ fontWeight: 700 }}>{matchedUser.name}</h3>
          {/* Social Links Row */}
          <div className="flex justify-center gap-2 mt-2">
            {contactInfo?.linkedinUrl && (
              <a
                href={contactInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-blue-500 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {contactInfo?.twitterUrl && (
              <a
                href={contactInfo.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-blue-500 transition-colors"
                title="Twitter Profile"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div className="space-y-3 px-6 pb-6 border-t border-gray-800 pt-3">
          <p className="text-sm text-center text-white/80">
            You can now connect with {matchedUser.name} directly!
          </p>
          <div className="flex flex-col gap-2 justify-center items-center">
            {contactInfo?.email && (
              <div className="w-full sm:w-auto">
                <span className="select-text text-blue-400">{contactInfo.email}</span>
              </div>
            )}
            {contactInfo?.scheduleUrl && (
              <Button
                variant="outline"
                className="w-full sm:w-auto border-blue-500/40 text-blue-500 hover:bg-blue-500/10 hover:text-white transition-all"
                onClick={() => window.open(contactInfo.scheduleUrl, '_blank')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            )}
          </div>
        </div>
        <DialogFooter className="bg-neutral-900 border-t border-gray-800 py-4 px-6 rounded-b-xl">
          <Button
            variant="secondary"
            className="w-full sm:w-auto bg-blue-500/40 text-white rounded-md hover:bg-blue-700/70 transition-all"
            onClick={() => onOpenChange(false)}
          >
            Continue Swiping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}