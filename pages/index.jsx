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
import { DotLottieReact } from '@lottiefiles/dotlottie-react'


const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '13:00 PM',
  '13:30 PM',
  '14:00 PM',
  '14:30 PM',
  '15:00 PM',
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
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
    setDatabase([
      ...database,
      {
        date: selectedDay,
        time: selectedTime,
      },
    ])
    setTimeout(() => {
      setLoading(false)
      setSelectedTime('')
      // setSelectedDay(selectedDay)
    }, 2500)
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
  }, [selectedDay, selectedTime])

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
                        isDayDisabled && 'hover:bg-white',
                        'mx-auto flex h-12 w-12 text-xl font-normal items-center justify-center rounded-full',
                      )}
                    >
                      <time
                        className={`${isBefore(day, today) && 'text-gray-300'} flex items-center ${isDayDisabled && 'text-gray-200'}`}
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
                {selectedTime &&
                  getUserTimezoneInfo().timeZoneAbbreviation.toUpperCase()}
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
                disabled={loading}
                  onClick={submit}
                  className="bg-black text-white flex justify-center w-full mt-6 py-4"
                >
                  {loading ? (
                    <DotLottieReact
                      className="w-20 h-auto"
                      src="https://lottie.host/7bd62d72-99d3-4435-b015-0bbd4cee7057/YRCbFnkgEd.lottie"
                      loop
                      autoplay
                    />
                  ) : (
                    <p>Book Appointment</p>
                  )}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
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
