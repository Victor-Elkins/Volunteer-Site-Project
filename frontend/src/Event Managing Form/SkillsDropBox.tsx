'use client'

import { useState } from 'react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const skills: string[] = [
  'Project Management',
  'Team Leadership',
  'Event Coordination',
  'Public Speaking',
  'Data Analysis',
  'Fundraising',
  'Marketing',
]

type DropdownProps = {
  selectedSkills: string[]
  onSkillsChange: (skills: string[]) => void
}

export default function Dropdown({ selectedSkills, onSkillsChange }: DropdownProps) {
  const [selected, setSelected] = useState<string[]>(selectedSkills)

  const handleSelection = (skill: string) => {
    let updatedSelected = [...selected];
    if (updatedSelected.includes(skill)) {
      updatedSelected = updatedSelected.filter(s => s !== skill); 
    } else {
      updatedSelected.push(skill); 
    }
    setSelected(updatedSelected);
    onSkillsChange(updatedSelected); // Pass string array directly
  };

  return (
    <Listbox as="div" multiple value={selected} onChange={setSelected}>
      <Label>Skills Required (Multiple can be selected):</Label>
      <div className="relative mt-2 mx-auto w-72">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
          <span className="block truncate">
            {selected.length > 0
              ? selected.join(', ')
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
              key={skill}
              value={skill}
              onClick={() => handleSelection(skill)} 
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
            >
              <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                {skill}
              </span>

              {selected.includes(skill) && (
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