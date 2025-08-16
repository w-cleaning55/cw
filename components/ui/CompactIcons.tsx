"use client";

import React from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Star,
  Shield,
  CheckCircle,
  Zap,
  Users,
  Award,
  Leaf,
  Home,
  Sparkles,
  Droplet,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

interface CompactIconProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

// Building and Location Icons
export const BuildingIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Building2 className={`${sizes[size]} ${className}`} />;

export const LocationIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <MapPin className={`${sizes[size]} ${className}`} />;

// Contact Icons
export const PhoneIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Phone className={`${sizes[size]} ${className}`} />;

export const EmailIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Mail className={`${sizes[size]} ${className}`} />;

// Rating and Quality Icons
export const StarIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Star className={`${sizes[size]} ${className}`} />;

export const ShieldIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Shield className={`${sizes[size]} ${className}`} />;

export const CheckIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <CheckCircle className={`${sizes[size]} ${className}`} />;

// Performance Icons
export const SpeedIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Zap className={`${sizes[size]} ${className}`} />;

export const UsersIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Users className={`${sizes[size]} ${className}`} />;

// Badge Icons
export const AwardIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Award className={`${sizes[size]} ${className}`} />;

export const EcoIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Leaf className={`${sizes[size]} ${className}`} />;

// Service Icons
export const HomeIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Home className={`${sizes[size]} ${className}`} />;

export const SparkleIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Sparkles className={`${sizes[size]} ${className}`} />;

export const WaterIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Droplet className={`${sizes[size]} ${className}`} />;

// Social Media Icons
export const FacebookIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Facebook className={`${sizes[size]} ${className}`} />;

export const TwitterIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Twitter className={`${sizes[size]} ${className}`} />;

export const InstagramIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Instagram className={`${sizes[size]} ${className}`} />;

export const YoutubeIcon: React.FC<CompactIconProps> = ({
  size = "sm",
  className = "",
}) => <Youtube className={`${sizes[size]} ${className}`} />;

// Company Logo Component (simplified)
export const CompanyLogo: React.FC<CompactIconProps & { src?: string }> = ({
  size = "md",
  className = "",
  src,
}) => {
  const [imgSrc, setImgSrc] = React.useState<string>(src || "/images/logo.png");
  const dimension = size === "xs" ? 16 : size === "sm" ? 20 : size === "md" ? 24 : 28;

  return (
    <img
      src={imgSrc}
      alt="شعار عالم النظافة"
      className={`${className}`}
      width={dimension}
      height={dimension}
      onError={() => setImgSrc("/images/logo.svg")}
    />
  );
};
