"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { Shader } from "react-shaders";
import { cn } from "@/lib/utils";

export interface SingularityShadersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  intensity?: number;
  size?: number;
  waveStrength?: number;
  colorShift?: number;
  mouseInteractive?: boolean;
}

const fragmentShader = `
void mainImage(out vec4 O, vec2 F)
{
    float i = .2 * u_speed, a;
    vec2 r = iResolution.xy;
    
    // Keep singularity centered - no position shift
    vec2 p = ( F+F - r ) / r.y / (.7 * u_size);
    
    // Calculate mouse influence on physics (not position)
    vec2 mouseNorm = u_mouse - 0.5;  // Normalized mouse from center
    float mouseDist = length(mouseNorm);
    float mouseAngle = atan(mouseNorm.y, mouseNorm.x);
    
    // Mouse creates gravitational distortion in the flow
    float mouseInfluence = mouseDist * 2.0;
    vec2 mouseFlow = mouseNorm * 0.3;
    
    vec2 d = vec2(-1,1),
         b = p - i*d,
         c = p * mat2(1, 1, d/(.1 + i/dot(b,b))),
         v = c * mat2(cos(.5*log(a=dot(c,c)) + iTime*i*u_speed + vec4(0,33,11,0)))/i,
         w = vec2(0.0);
    
    // Distance from center for local mouse effects
    float distFromCenter = length(p);
    
    for(float j = 0.0; j < 9.0; j++) {
        i++;
        
        // Mouse affects wave turbulence based on proximity
        float localMouseEffect = exp(-length(v - mouseNorm * 2.0)) * mouseInfluence;
        w += 1.0 + sin(v * u_waveStrength + localMouseEffect);
        
        // Turbulence reacts to mouse - creates swirling effect
        vec2 mouseDistortion = mouseFlow * sin(iTime * u_speed + mouseAngle);
        v += .7 * sin(v.yx * i + iTime * u_speed + mouseDistortion.x * 3.0) / i + .5;
        
        // Mouse pulls on the flow field
        v += mouseFlow * 0.15 * exp(-distFromCenter);
    }
    
    i = length( sin(v/.3)*.4 + c*(3.+d) );
    
    // Color gradient affected by mouse proximity and movement (#d8ff00)
    vec4 colorGrad = vec4(0.6, 1.0, -0.5, 0) * u_colorShift;
    
    // Mouse Y affects color intensity in clouds
    float colorPulse = sin(iTime * 2.0 + u_mouse.y * 6.28) * 0.2;
    colorGrad.x += colorPulse;
    
    vec4 singularity = 1. - exp( -exp( c.x * colorGrad )
                   / w.xyyx
                   / ( 2. + i*i/4. - i )
                   / ( .5 + 1. / a )
                   / ( .03 + abs( length(p)-.7 ) )
                   * u_intensity
             );
    
    // Brightness pulses based on mouse movement energy
    float mouseEnergy = length(mouseNorm) * 0.5 + 1.0;
    float brightnessModulation = 0.9 + sin(mouseAngle * 2.0 + iTime) * 0.1 * mouseDist;
    
    O = vec4(
        (singularity.r * 0.5 + singularity.g * 0.5) * mouseEnergy * brightnessModulation,
        singularity.g * mouseEnergy * brightnessModulation,
        singularity.b * 0.1,
        1.0
    );
}
`;

export const SingularityShaders = forwardRef<
  HTMLDivElement,
  SingularityShadersProps
>(
  (
    {
      className,
      speed = 1.0,
      intensity = 1.0,
      size = 1.0,
      waveStrength = 1.0,
      colorShift = 1.0,
      mouseInteractive = true,
      ...props
    },
    ref
  ) => {
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
      if (!mouseInteractive) return;

      const handleMouseMove = (e: MouseEvent) => {
        const x = e.clientX / window.innerWidth;
        const y = 1.0 - e.clientY / window.innerHeight; // Invert Y for shader coords
        setMousePos({ x, y });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseInteractive]);

    return (
      <div ref={ref} className={cn("w-full h-full", className)} {...props}>
        <Shader
          fs={fragmentShader}
          uniforms={{
            u_speed: { type: "1f", value: speed },
            u_intensity: { type: "1f", value: intensity },
            u_size: { type: "1f", value: size },
            u_waveStrength: { type: "1f", value: waveStrength },
            u_colorShift: { type: "1f", value: colorShift },
            u_mouse: { type: "2f", value: [mousePos.x, mousePos.y] },
          }}
          style={{ width: "100%", height: "100%" } as CSSStyleDeclaration}
        />
      </div>
    );
  }
);

SingularityShaders.displayName = "SingularityShaders";
