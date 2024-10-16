'use client'

// import { useState } from 'react'
import {Label, Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'

export type Skill = {
  id: number
  name: string
}

const skills: Skill[] = [
  { id: 1, name: 'Project Management' },
  { id: 2, name: 'Team Leadership' },
  { id: 3, name: 'Event Coordination' },
  { id: 4, name: 'Public Speaking' },
  { id: 5, name: 'Data Analysis' },
  { id: 6, name: 'Fundraising' },
  { id: 7, name: 'Marketing' },
]

interface DropdownProperties {
  selectedSkills: Skill[];
  setSelectedSkills: (skills: Skill[]) => void;
}

export default function Dropdown({ selectedSkills, setSelectedSkills }: DropdownProperties) {
  const handleSelection = (skills: Skill[]) => {
    setSelectedSkills(skills)
  }

  return (
    <Listbox value={selectedSkills} onChange={handleSelection} multiple>
      <Label className="block text-sm font-medium leading-6 text-gray-900">Skills <span className="text-red-500">*</span></Label>
      <div className="relative mt-2 mx-auto w-72">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
          <span className="block truncate">
            {selectedSkills.length > 0
              ? selectedSkills.map((skill) => skill.name).join(', ')
              : 'Select skills'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
          </span>
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          {skills.map((skill) => (
            <ListboxOption
              key={skill.id}
              value={skill}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
            >
              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                {skill.name}
              </span>

              {selectedSkills.some((s) => s.id === skill.id) && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                  <CheckIcon aria-hidden="true" className="h-5 w-5" />
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
