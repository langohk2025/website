'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  defaultCharacterId,
  storyworldCharacters,
  storyworldStoryline,
} from '@/data/storyworld'
import { PageContainer, Section } from '@/components/ui/section'
import { H4, Label1, Label4, ProductBody } from '@/components/ui/typography'
import { Reveal } from '@/components/ui/motion'
import { StoryworldVideoPlayer } from '@/components/storyworld/StoryworldVideoPlayer'
import { springUI } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function StoryworldPageContent() {
  const [activeId, setActiveId] = useState(defaultCharacterId)
  const activeCharacter =
    storyworldCharacters.find((character) => character.id === activeId) ??
    storyworldCharacters[0]

  return (
    <Section className="py-16">
      <PageContainer>
        <div className="flex flex-col items-center gap-[86px]">
          <div className="flex w-full flex-col items-center gap-16 lg:gap-20">
            <Reveal className="relative z-10 flex w-full flex-col items-center gap-3 text-center">
              <h1 className="font-poppins text-[50px] font-semibold leading-[1.5] tracking-[-0.55px] text-font-500">
                <span className="block">Learning Through</span>
                <span className="block">Stories, Characters, and Adventures</span>
              </h1>
              <Label4 as="p" className="max-w-[858px] text-font-400">
                Lango turns language learning into missions and story journeys. Learners
                practise vocabulary, pronunciation, dialogue, and communication through
                memorable characters and interactive scenarios.
              </Label4>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="flex w-full max-w-[1204px] flex-col items-center px-[42px]">
                <div className="flex w-full flex-col items-center gap-[60px]">
                  <div className="relative w-full pt-16 sm:pt-20">
                    <div className="flex w-full flex-wrap items-end justify-center gap-4">
                      {storyworldCharacters.map((character) => {
                        const isActive = character.id === activeId

                        return (
                          <motion.button
                            key={character.id}
                            type="button"
                            onMouseEnter={() => setActiveId(character.id)}
                            onFocus={() => setActiveId(character.id)}
                            onClick={() => setActiveId(character.id)}
                            aria-label={`View ${character.name}`}
                            aria-pressed={isActive}
                            animate={{
                              scale: isActive ? 1.12 : 1,
                              opacity: isActive ? 1 : 0.72,
                              zIndex: isActive ? 10 : 1,
                            }}
                            transition={springUI}
                            className={cn(
                              'relative shrink-0 cursor-pointer',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2'
                            )}
                            style={{
                              width: `${character.imageWidth}px`,
                              height: `${character.imageHeight}px`,
                              maxWidth: '100%',
                              transformOrigin: 'bottom center',
                            }}
                          >
                            <Image
                              src={character.imageSrc}
                              alt={character.name}
                              width={character.imageWidth}
                              height={character.imageHeight}
                              className="pointer-events-none h-full w-full object-contain object-bottom"
                              draggable={false}
                            />
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  <div
                    className={cn(
                      'w-full max-w-[856px] rounded-[40px] border-2 border-white',
                      'bg-gradient-to-br from-[#fbf5ff] to-[#fcf7fe]',
                      'px-[56px] py-[36px] pl-[57px]',
                      'shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)]'
                    )}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCharacter.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="flex flex-col gap-[8px]"
                      >
                        <Label1 as="h2" className="text-font-400">
                          {activeCharacter.name}
                        </Label1>
                        <ProductBody>{activeCharacter.bio}</ProductBody>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="flex w-full flex-col items-center justify-between gap-y-12 lg:flex-row lg:items-center">
            <div className="flex max-w-[475px] flex-col gap-1">
              <H4>{storyworldStoryline.title}</H4>
              <ProductBody>{storyworldStoryline.description}</ProductBody>
            </div>

            <div
              className="mx-auto w-full shrink-0 lg:mx-0"
              style={{
                maxWidth: `${storyworldStoryline.width}px`,
              }}
            >
              <StoryworldVideoPlayer youtubeId={storyworldStoryline.youtubeId} />
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </Section>
  )
}
