import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns'
import { useEffect, useState } from 'react'

const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  // '11:00 AM',
  // '11:30 AM',
  // '12:00 PM',
  // '12:30 PM',
  // '13:00 PM',
  // '13:30 PM',
  // '14:00 PM',
  // '14:30 PM',
  // '15:00 PM',
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [selectedTime, setSelectedTime] = useState('')
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  const [database, setDatabase] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function getUserTimezoneInfo() {
    const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone
    const now = today

    // Get timezone abbreviation
    const options = { timeZoneName: 'short' }
    const formatter = new Intl.DateTimeFormat('en-US', options)
    const timeZoneAbbreviation = formatter
      .formatToParts(now)
      .find((part) => part.type === 'timeZoneName')?.value

    return { tzid, timeZoneAbbreviation }
  }

  const submit = () => {
    setDatabase([
      ...database,
      {
        date: selectedDay,
        time: selectedTime,
      },
    ])
  }

  useEffect(() => {
    const getAvailableSlots = () => {
      const dd = database.filter((e) => isSameDay(e.date, selectedDay))
      const tt = timeSlots.filter((slot) => {
        return !dd.some((appt) => appt.time === slot)
      })
      setAvailableSlots(tt.length > 0 ? tt : [])
    }

    getAvailableSlots()
  }, [selectedDay])

  return (
    <div className="pt-16">
      <div className="bg-white drop-shadow max-w-md p-8 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-normal text-gray-900">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-black hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-black hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 font-semibold mt-10 text-xl leading-6 text-center text-gray-800">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 mt-2">
              {days.map((day, dayIdx) => {
                // Check if the day has available slots
                const isDayDisabled = (() => {
                  const dd = database.filter((e) => isSameDay(e.date, day))
                  const available = timeSlots.filter((slot) => {
                    return !dd.some((appt) => appt.time === slot)
                  })
                  return available.length === 0 // Disable if no slots available
                })()

                return (
                  <div
                    key={day.toString()}
                    className={classNames(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      'py-1.5',
                    )}
                  >
                    <button
                      disabled={isBefore(day, today) || isDayDisabled}
                      onClick={() => {
                        setSelectedDay(day)
                        setSelectedTime('')
                      }}
                      className={classNames(
                        isEqual(day, selectedDay) && 'text-white',
                        !isEqual(day, selectedDay) &&
                          isToday(day) &&
                          'text-red-500',
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          'text-gray-900',
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          'text-gray-400',
                        isEqual(day, selectedDay) && isToday(day) && 'bg-black',
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          'bg-gray-900',
                        !isEqual(day, selectedDay) &&
                          isAfter(day, today) &&
                          'hover:bg-gray-200',
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          'font-semibold',
                        isBefore(day, today) && 'text-gray-200',
                        isDayDisabled && 'text-gray-200 hover:bg-white',
                        'mx-auto flex h-12 w-12 text-xl font-normal items-center justify-center rounded-full',
                      )}
                    >
                      <time
                        className="flex items-center"
                        dateTime={format(day, 'yyyy-MM-dd')}
                      >
                        {format(day, 'd')}
                      </time>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
          <section className="mt-12 md:mt-0 md:pl-14">
            <h2 className="text-gray-900">
              <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                {format(selectedDay, 'MMMM dd, yyy')}{' '}
                {selectedTime && `@ ${selectedTime}`}{' '}
                {getUserTimezoneInfo().timeZoneAbbreviation.toUpperCase()}
              </time>
            </h2>
            <p className="mt-2 space-y-1 text-xs leading-6 font-semibold text-black">
              TIME ZONE: {getUserTimezoneInfo().tzid.toUpperCase()}{' '}
              {getUserTimezoneInfo().timeZoneAbbreviation.toUpperCase()}
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4 space-y-1 text-2xl leading-6 text-black">
              {!selectedTime &&
                availableSlots.map((time, i) => {
                  return (
                    <button
                      onClick={() => setSelectedTime(time)}
                      className="border py-3 hover:bg-gray-300"
                      key={i}
                    >
                      {time}
                    </button>
                  )
                })}
            </div>
            <div className="w-full">
              {selectedTime && (
                <button
                  onClick={submit}
                  className="bg-black text-white w-full mt-6 py-4"
                >
                  Book Appointment
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Meeting({ meeting }) {
  let startDateTime = parseISO(meeting.startDatetime)
  let endDateTime = parseISO(meeting.endDatetime)

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <img
        src={meeting.imageUrl}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, 'h:mm a')}
          </time>{' '}
          -{' '}
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, 'h:mm a')}
          </time>
        </p>
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <MenuButton className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={classNames(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                  >
                    Edit
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={classNames(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                  >
                    Cancel
                  </a>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </li>
  )
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]
